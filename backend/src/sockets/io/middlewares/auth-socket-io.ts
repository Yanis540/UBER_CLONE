
import jwt, { JwtPayload } from 'jsonwebtoken';
import {Socket} from 'socket.io'
import { AuthError } from '../../../middlewares/auth/middlewares/types';
import { db } from '../../../libs/db';
import { ExtendedError } from 'socket.io/dist/namespace';
import { includeDriver } from '../../../routes/Driver/types';
/**
 * 
 * @param socket :  socket 
 * @does Verify if the accessToken is valid or not 
 * @return socket.user
 * @error  {message,cause}
 */
export const authUserSocket=async(socket:Socket, next:(err?: ExtendedError | undefined) => void)=>{
    try{
        if(!socket.handshake.headers || ! socket.handshake.headers.authorization || ! socket.handshake.headers.authorization.startsWith('Bearer') ) 
            throw new Error('Unauthorized')
        ;
        const token=socket.handshake.headers.authorization.split(' ')[1];
        let  decoded:string |JwtPayload;
        try{
            decoded =<JwtPayload>jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!);
        }
        catch(err:any){
            throw new Error("Invalid Token",{cause:AuthError.EXPIRED_ACCESS_TOKEN});
        }
        if(!decoded?.id) {
            throw new Error("Unauthorized",{cause:AuthError.UNAUTHORIZED_ACCESS_TOKEN,});
        }
        
        const user = await db.user.findFirst({
            where:{id:decoded.id}, 
            include:{
                driver:true
            }
        });
        if(!user){
            throw new Error("Unauthorized",{cause:AuthError.EXPIRED_ACCESS_TOKEN,});
        }
        socket.user= user; 
        next()
    }
    catch(err:any){
        socket.emit('error',{message:err.message,cause:err.cause})
    }
}
