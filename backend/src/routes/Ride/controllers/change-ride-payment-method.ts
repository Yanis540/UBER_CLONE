// Card -> to Cash | Cash-> 
import { z} from "zod";
import { db } from "../../../libs/db";
import {Response , Request} from "express"
import { errorHandler } from "../../../util";
import { RideError, includeRide } from "../types";
import { Ride, User , StripePaymentIntent } from "@prisma/client";
import { Payment, StripePayment } from "../../../libs/payment";



const bodySchema = z.object({
    id:z.string() // ride id 
}) 

interface RideRequest extends Request{
    params: z.infer<typeof bodySchema> ,
}
export const change_ride_payment_method = async(req:RideRequest, res:Response)=>{
    try{
        const schema = bodySchema.parse(req.params)
        const existingRide : RideWithPaymentAndDriver|null= await db.ride.findFirst({
            where:{id:schema.id,user:{id:req.user?.id}}, 
            include:{
                driver:true, 
                payment_intent:{
                    include:{
                        stripe_payment_intent:true
                    }
                }
            }
        })
        if(!existingRide){
            res.status(404) 
            throw new Error(`No ride with ID : ${schema.id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        // Cancelled || finished 
        if(existingRide.ride_status=="cancelled"|| existingRide.ride_status=="finished"){
            res.status(403)
            const {message,cause} = 
                existingRide.ride_status=="cancelled"
                ?   {message:"Ride Cancelled",cause:RideError.RIDE_CANCELLED}
                :   {message:"Ride Finished ",cause:RideError.RIDE_FINISHED}; 
            throw new Error(message,{cause}); 
        }
        // not finished && not cancelled  

        // Cash -> Payment : done anyways cause the cash payment is validated at the end  
        if(existingRide.payment_type=="cash" ){
            // other wise create a paymentIntent 
            const updated_ride = await update_payment_cash_to_card({user:req.user!, ride:existingRide})
            res.status(201).json({message:"Card Payment in use ",ride: updated_ride })
            return; 
        }

        // Card -> cash : done only when the payment is not succeded and the payment intent exists 
        //              -   other words : you can't change if it's succeded or if the paymentIntent (previously didn't exist)
        if(existingRide.payment_status=="succeeded" ||!existingRide.payment_intent){
            res.status(403); 
            const {message,cause} = 
                existingRide.payment_status=="succeeded"
                ?   {message:"Ride Paid",cause:RideError.RIDE_PAID}
                :   {message:"No payment intent found", cause:RideError.RIDE_UNPAID}
            throw new Error(message,{cause})
        }

        //! Change if you're using another payment gatway  
        const updated_ride = await update_payment_card_to_cash({ride:existingRide as any })
        res.status(201).json({message:"Cash payment in use",ride:updated_ride})
    }
    catch(err:any){
        console.log(err.message,"METHOD_PAYMENT_CHANGED_RIDE")
        errorHandler(err,res)
    }
}


const update_payment_cash_to_card = async({user,ride}:{user:User,ride:Ride})=>{
    const payment = new Payment(new StripePayment()) 
    const {paymentIntent,ephemeralKey, customer} = await payment.createPaymentIntent({user:user!,total:ride.total})
    const updated_ride = await db.ride.update({
        where:{id:ride.id}, 
        data:{
            payment_type:"card", 
            payment_status:"processing",
            payment_intent:{
                create:{
                    id :paymentIntent.id!, 
                    payment_gateway:"stripe",
                    stripe_payment_intent:{
                        create:{
                            client_secret:(paymentIntent.client_secret as string),
                            ephemeralKey_secret:(ephemeralKey.secret as string ), 
                            customer_id : customer.id
                        }
                    }
                }
            }
        }, 
        include:includeRide(user!?.id)
    })
    return updated_ride
}

const update_payment_card_to_cash = async({ride}:{ride:RideWithPaymentAndDriver})=>{
    const payment = new Payment(new StripePayment()) 
    await payment.cancelPaymentIntent(ride.payment_intent!.stripe_payment_intent!?.id); 
    const updated_ride = await db.ride.update({
        where:{id:ride.id }, 
        data:{
            payment_type:"cash", 
            payment_intent:{
                delete:{
                    id:ride.payment_intent!.stripe_payment_intent!?.id
                }
            }
        }, 
        include:includeRide(ride.user_id)
    })
    return updated_ride
}