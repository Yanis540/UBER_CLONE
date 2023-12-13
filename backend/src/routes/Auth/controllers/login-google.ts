import asyncHandler from "express-async-handler";
import {z} from "zod";
import { db } from "../../../libs/db";
import {Response, Request as ExpressRequest} from "express"
import { generateAuthToken } from "../../../tokens";
import { errorHandler } from "../../../util";
import { includeUser } from "../../Ride/types";

const loginBody = z.object({
    userInfo: z.object({
        user:z.object({
            id:z.string(), 
            email:z.string(), 
            name:z.string().nullable().optional(), 
            photo:z.string().nullable().optional(), 
            familyName:z.string().nullable().optional(), 
            givenName:z.string().nullable().optional(), 
        }) , 
        scopes : z.array(z.string()).optional(), 
        idToken: z.string().nullable().optional(), 
        serverAuthCode: z.string().nullable().optional()
        
    })
})

type LoginBody = z.infer<typeof loginBody>
interface Request extends ExpressRequest {
    body:LoginBody
}


const login_google_controller = async(req:Request,res:Response)=>{
    try{
        const {userInfo} = loginBody.parse(req.body); 
        const existingUser = await db.user.findFirst({
            where:{
                email : userInfo.user.email
            }, 
            include:includeUser
         
        }); 
        let createdUser ; 
        if(!existingUser) {
            createdUser =  await db.user.create({
                data:{
                    email: userInfo.user.email,
                    id: userInfo.user.id,
                    photo: userInfo.user.photo,
                    phone_number:"",
                    name: userInfo.user.name??`${userInfo.user.familyName??""} ${userInfo.user.givenName??""}`
                }, 
                include:includeUser
            })
        }
       
        // create and send tokens 
        const {accessToken,refreshToken,expiresIn} = generateAuthToken(existingUser?existingUser.id: createdUser!.id);
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

export{ login_google_controller}