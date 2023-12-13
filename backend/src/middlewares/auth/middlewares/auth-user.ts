import {  Response , NextFunction, Request } from "express";
import {AuthError} from "./types"
import jwt, { JwtPayload } from "jsonwebtoken"
import { db } from "../../../libs/db";




const authUser = async(req:Request, res:Response , next:NextFunction)=>{
    try{
        if(!req?.headers || !req?.headers?.authorization?.startsWith("Bearer") ){
            res.status(401)
            throw new Error("Unauthorized",{cause:AuthError.UNAUTHORIZED_ACCESS_TOKEN,})
        }
        const token = req.headers.authorization.split(" ")[1];
        let  decoded:string |JwtPayload;
        try{
            decoded =<JwtPayload>jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!);
        }
        catch(err:any){
            res.status(403)
            throw new Error("Invalid Token",{cause:AuthError.EXPIRED_ACCESS_TOKEN});
        }
        if(!decoded?.id) {
            res.status(401);
            throw new Error("Unauthorized",{cause:AuthError.UNAUTHORIZED_ACCESS_TOKEN,});
        }
        
        const user = await db.user.findFirst({
            where:{id:decoded.id}, 
            include:{
                driver:{
                    include:{
                        cars:{
                            include:{
                                _count:{
                                    select:{rides:true}
                                }, 
                            }, 
                            orderBy:{
                                rides:{
                                    _count:"desc" as any
                                }
                            }
                        }
                    }
                }
            }
        });
        if(!user){
            res.status(403)
            throw new Error("Unauthorized",{cause:AuthError.EXPIRED_ACCESS_TOKEN,});
        }
        req.user= user ; 
        next();
    }
    catch(err:any){
        throw new Error(err.message,{cause:err.cause})
    }
}
const authAdmin = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        if(!req.user || req.user.role!="ADMIN"){
            res.status(401); 
            throw new Error("Unauthorized",{cause:AuthError.UNAUTHORIZED_ADMIN_ACCESS})
        }
        next();
    }
    catch(err:any){
        throw new Error(err.message,{cause:err.cause})
        
    }
}
const authDriver = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        if(!req.user || req.user.role!="DRIVER"){
            res.status(401); 
            throw new Error("Unauthorized",{cause:AuthError.UNAUTHORIZED_ADMIN_ACCESS})
        }
        next();
    }
    catch(err:any){
        throw new Error(err.message,{cause:err.cause})
        
    }
}

export {
    authUser, 
    authAdmin, 
    authDriver
}



