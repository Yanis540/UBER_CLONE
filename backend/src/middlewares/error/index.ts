import { Request , Response , NextFunction } from "express"


const errorMiddleware = (err:ErrorInstance,req:Request,res:Response,next:NextFunction)=>{
    const status =  res.statusCode ?? 500;  
    const error = {
        message: err.message, 
        cause : err.cause , 
        stack : process.env.NODE_ENV != "production" ? err.stack : null 
    }
    res.status(status).json({error});
}

export {errorMiddleware}