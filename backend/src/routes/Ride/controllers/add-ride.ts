import { Request, Response } from "express"; 
import { z} from "zod";
import { db } from "../../../libs/db";
import { errorHandler } from "../../../util";
import { add_new_address } from "../../Address/util";
import { CarType, PaymentType } from "@prisma/client";
import { Payment, StripePayment } from "../../../libs/payment";
import { driver_events } from "./events";
import { includeRide } from "../types";


const bodySchema =z.object({
    starting_at : z.string().datetime().optional(),
    car_type : z.enum([CarType.family,CarType.premium,CarType.standard,CarType.suv]), 
    payment_type: z.enum([PaymentType.card, PaymentType.cash]).optional(),
    start_address_place_id :z.string(), 
    destination_address_place_id :z.string(),
    distance : z.number(),  
    total : z.number() , 
    total_time : z.string(), 
    user_gps_localisation:z.object({
        longitude : z.number() , 
        latitude: z.number()
    })
     
})

type BodySchema = z.infer<typeof bodySchema>
interface RideRequest extends Request {
    body:BodySchema,
    params:{
        id:string
    }
}

/**  
*   @function add_ride_controller 
*   @description adds a ride, or just updates the ride if the user choose payment online (credit card)
*/
const add_ride_controller = async(req:RideRequest, res:Response)=>{
    try{
        // Search Address 
        console.log(req.body)
        const schema = bodySchema.parse(req.body); 
        const isStartAddressExisting = await db.address.findFirst({
            where:{id:schema.start_address_place_id}
        })
        if(!isStartAddressExisting)
            await add_new_address(schema.start_address_place_id,res)
        
        const isDestinationAddressExisting = await db.address.findFirst({
            where:{id:schema.destination_address_place_id}
        })
        if(!isDestinationAddressExisting)
            await add_new_address(schema.destination_address_place_id,res)
        
        let ride ; 
        
        //! If it's a payment 
        if(schema?.payment_type == "cash" || ( ! schema.payment_type &&(req.user?.prefered_payment_type=="cash")))
            ride = await create_cash_ride(req,schema); 
        else 
            ride = await create_card_ride(req,schema)

        //! SEND SOCKET TO :  Drivers 
        await driver_events.notify_drivers_of_proposed_ride({ride,radius:10})    
        
        // ! Push notifications to drivers also 

        res.status(201).json({message:"Ride Added ",ride})
    }
    catch(err:any){
        console.log(err.message,"ADD_RIDE")
        errorHandler(err,res)
    }
}

const create_cash_ride = async(req:RideRequest,schema:BodySchema)=>{
    return await db.ride.create({
        data:{
            user_gps_localisation:{
                longitude:schema.user_gps_localisation.longitude, 
                latitude:schema.user_gps_localisation.latitude, 
            }, 
            user:{
                connect:{
                    id:req.user?.id!
                }
            },
            total_time: schema.total_time, 
            starting_at : schema.starting_at??new Date(), 
            start_address:{
                connect:{
                    id:schema.start_address_place_id
                }
            }, 
            destination_address:{
                connect:{
                    id:schema.destination_address_place_id
                }
            }, 
            car_type : schema.car_type , 
            payment_type:"cash",
            payment_status:"processing", 
            currency:"usd", 
            total: schema.total , 
            distance: schema.distance, 
            ride_status:"proposed"
        }, 
        include:includeRide(req.user!?.id)
    })
}
const create_card_ride = async(req:RideRequest,schema:BodySchema)=>{
    // using Payment Intent  
    const payment = new Payment(new StripePayment()) 
    const {paymentIntent,ephemeralKey, customer} = await payment.createPaymentIntent({user:req.user!,total:schema.total}); 
    //! Create new Ride DATABASE : status of payment : processing 
    return await db.ride.create({
        data:{
            user_gps_localisation:{
                longitude:schema.user_gps_localisation.longitude, 
                latitude:schema.user_gps_localisation.latitude, 
            }, 
            user:{
                connect:{ id:req.user?.id !}
            },
            starting_at : schema.starting_at??new Date(), 
            total_time: schema.total_time, 
                start_address:{
                connect:{ id:schema.start_address_place_id }
            }, 
            destination_address:{
                connect:{ id:schema.destination_address_place_id}
            }, 
            car_type : schema.car_type , 
            payment_type:"card",
            payment_status:"processing", 
            payment_intent:{
                create:{
                    id:paymentIntent.id,
                    payment_gateway:"stripe",
                    stripe_payment_intent:{
                        create:{
                            client_secret:(paymentIntent.client_secret as string),
                            ephemeralKey_secret:(ephemeralKey.secret as string ), 
                            customer_id : customer.id
                        }
                    }
                }
            },
            currency:"usd", 
            total: schema.total , 
            distance: schema.distance, 
            ride_status:"proposed", 
            
        }, 
        include:includeRide(req.user!?.id)
    });
}

export {add_ride_controller}