import {  Response , NextFunction, Request } from "express";
import {AuthError} from "./types"
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();


const authGoogle = async(req:Request, res:Response , next:NextFunction)=>{
    try{
        if(!req?.headers || !req?.headers?.authorization?.startsWith("Bearer") ){
            res.status(401)
            throw new Error("Unauthorized",{cause:AuthError.UNAUTHORIZED_ACCESS_TOKEN,})
        }
        const token = req.headers.authorization.split(" ")[1];
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID!,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
    catch(err:any){
        throw new Error(err.message,{cause:err.cause})
    }
}

export {
    authGoogle
}



