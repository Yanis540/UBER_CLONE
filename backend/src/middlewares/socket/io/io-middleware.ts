import { NextFunction, Response , Request } from "express"
import { io } from "../../../../server"



export const ioMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    req.io =io
    next()
}