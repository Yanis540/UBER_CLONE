import { PrismaClientKnownRequestError , PrismaClientUnknownRequestError } from "@prisma/client/runtime/library"
import { Response } from "express"
import { ZodError } from "zod"

export const errorHandler = (err:any,res:Response)=>{
    if(err instanceof ZodError){
        res.status(400)
        throw new Error("Invalid Input",{cause:"INVALID_INPUT"})
    }
    if(err?.cause){
        throw new Error(err.message,{cause:err.cause})
    }
    if(err instanceof PrismaClientKnownRequestError || err instanceof PrismaClientUnknownRequestError ){
        res.status(403)
        throw new Error("Error with databaase ")
    }
    res.status(500)
    throw new Error("Internal server error")
}