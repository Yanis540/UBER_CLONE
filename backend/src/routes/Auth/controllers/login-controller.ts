import { z} from "zod";
import { db } from "../../../libs/db";
import {Response , Request as ExpressRequest} from "express"
import bcrypt from "bcrypt"
import { generateAuthToken } from "../../../tokens";
import { errorHandler } from "../../../util";
import { includeUser } from "../../Ride/types";

const loginSchema = z.object({
    email :z.string().email(), 
    password : z.string()
})

type LoginSchema = z.infer<typeof loginSchema>
interface Request extends ExpressRequest {
    body:LoginSchema
}


const login_controller = async(req:Request,res:Response)=>{
    try{
        const {email,password} = loginSchema.parse(req.body); 
        const existingUser = await db.user.findFirst({
            where:{
                email
            }, 
            include:includeUser
        }); 
        if(!existingUser) {
            res.status(404)
            throw new Error(`No user with email ${email}`, {cause:"EMAIL_NOT_FOUND"});
        }
        const passwordMatch = await bcrypt.compare(password,existingUser.hashedPassword!);
        if(!passwordMatch){
            res.status(401)
            throw new Error("Invalid password",{cause:"INVALID_PASSWORD"})
        }
        // create and send tokens 
        const {accessToken,refreshToken,expiresIn} = generateAuthToken(existingUser.id);
        res.status(201).json({
            user : {
                ...existingUser,
                hashedPassword:undefined ,
            },
            tokens:{
                access:{
                    token:accessToken, expiresIn 
                }, 
                refresh:{
                    token:refreshToken
                }
            } 
        })
    }
    catch(err:any){
        console.log(err.message,"LOGIN")
        errorHandler(err,res)


    }

        // const {}
}

export{ login_controller}