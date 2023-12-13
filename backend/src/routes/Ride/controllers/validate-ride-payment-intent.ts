import { Request, Response } from "express";
import { db } from "../../../libs/db";
import { z } from "zod"
import Stripe from "stripe";
import { errorHandler } from "../../../util";
import { RideError, includeRide } from "../types";
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET)


const validatePaymentSchema = z.object({
    id : z.string()
})
type ValidatePaymentSchema = z.infer<typeof validatePaymentSchema>
interface ValidatePaymentIntentRequest extends Request {
  params : ValidatePaymentSchema, 
}
export const validate_stripe_payment_intent = async(req:ValidatePaymentIntentRequest,res:Response)=>{
    try{
        const schema = validatePaymentSchema.parse(req.params)
        const existingRide = await db.ride.findFirst({
            where:{
                id:schema.id,
                user:{id:req.user?.id}
            }, 
            include:{
                payment_intent:{
                    include:{
                        stripe_payment_intent:true
                    }
                }
            }
        }); 
        // if it's not the case just throw an erorr
        if(!existingRide){
            res.status(404)
            throw new Error(`Ride with id ${schema.id} Not Found`,{cause:RideError.RIDE_NOT_FOUND})
        }
        // No payment Intent saved in database 
        if(!existingRide.payment_intent || existingRide.payment_type=="cash" ){
            res.status(403); 
            throw new Error(`Incorrect Payment method.`,{cause:RideError.INCORRECT_PAYMENT_METHOD})
        }
        // Cancelled  
        if(existingRide.ride_status=="cancelled"||  existingRide.payment_status=="cancelled"){
            res.status(403)
            throw new Error("Ride Cancelled",{cause:RideError.RIDE_CANCELLED})
        }
        // if it's already payed 
        if(existingRide.payment_status=="succeeded"){
            res.status(403); 
            throw new Error("Ride Already Payed", {cause:RideError.RIDE_PAID})
        }
        
        
        const paymentIntent = await stripe.paymentIntents.retrieve(existingRide.payment_intent.stripe_payment_intent!.id); 
        if(!paymentIntent){
            res.status(404);
            throw new Error(`No transaction with number ${paymentIntent} `,{cause:RideError.RIDE_UNPAID}); 
        }
        // Payment not successfull Done : InValid payment && throw an error    
        if(paymentIntent.status!="succeeded"){
            res.status(403)
            throw new Error("Invalid Payment Please Try Again",{cause:RideError.RIDE_UNPAID}) 
        }
        // otherwise update the ride 
        const updated_ride = await db.ride.update({
            where:{
                id : schema.id
            }, 
            data:{
                payment_status:"succeeded", 
            } , 
            include:includeRide(req.user!?.id)
        }); 
        res.json({message :"Payment Successfull !", ride:updated_ride});
    }
    catch(err:any){
        console.log(err.message,"VALIDATE_PAYMENT_INTENT")
        errorHandler(err,res)
    }
}