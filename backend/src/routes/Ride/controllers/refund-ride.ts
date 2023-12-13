import { z} from "zod";
import { db } from "../../../libs/db";
import {Response , Request} from "express"
import { errorHandler } from "../../../util";
import { RideError, includeRide } from "../types";
import { Payment, StripePayment } from "../../../libs/payment";



const bodySchema = z.object({
    id:z.string() // ride id 
}) 

interface RideRequest extends Request{
    params: z.infer<typeof bodySchema> ,
}

export const refund_ride = async(req:RideRequest, res:Response)=>{
    try{
        const schema = bodySchema.parse(req.params); 
        const ride = await db.ride.findFirst({
            where:{
                id : schema.id,
                user:{
                    id: req.user!?.id
                } 
            }, 
            include:{
                payment_intent:{
                    include:{
                        stripe_payment_intent:true 
                    }
                }
            }
        }); 
        // if no payment intent throw an error 
        if(!ride || ! ride.payment_intent ||  ! ride.payment_intent.stripe_payment_intent){
            res.status(404); 
            throw new Error(!ride? "No ride": "Can't refund cash payment",{cause:RideError.INCORRECT_PAYMENT_METHOD})
        }
        // can refund only when the payment status is succeded and ( the ride is either finished or is cancelled )
        if(ride.payment_status != "succeeded" || ride.ride_status!="cancelled"){
            res.status(401); 
            throw new Error("Unable to refund", {cause: RideError.INVALID_REFUND})
        }
        const payment = new Payment(new StripePayment()); 
        const refund = await payment.refundPaymentIntent(ride.payment_intent.id); 
        if(!refund){
            res.status(403); 
            throw new Error("Unable to refund",{cause:RideError.INVALID_REFUND})
        }
        const updated_ride = await db.ride.update({
            where:{
                id: schema.id, 
            }, 
            data:{
                payment_status:"refunded"
            }, 
            include:includeRide(req.user!?.id)
        })

        res.status(201).json({message:"Refunded",ride : updated_ride})
    }
    catch(err:any){
        console.log(err.message,"REFUND_RIDE")
        errorHandler(err,res)
    }
}