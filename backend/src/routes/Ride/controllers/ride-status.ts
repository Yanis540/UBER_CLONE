import { z} from "zod";
import { db } from "../../../libs/db";
import {Response , Request} from "express"
import { errorHandler } from "../../../util";
import { RideError , includeRide } from "../types";
import { user_events } from "./events";
import { Car } from "@prisma/client";
const acceptRideBodySchema = z.object({
    car_id : z.string().optional(), 
})
interface RideRequest extends Request {
    body :z.infer<typeof acceptRideBodySchema>
    params:{
        id:string
    }
}

const accept_ride_controller = async(req:RideRequest, res:Response)=>{
    try{
        const {id} = req.params ;
        const {car_id} = acceptRideBodySchema.parse(req.body) 
        if(!id){
            res.status(403) ;
            throw new Error("No ID specified",{cause:RideError.RIDE_NOT_FOUND}); 
        }
        const existingRide = await db.ride.findFirst({
            where:{id}, 
        })
        if(!existingRide){
            res.status(404) 
            throw new Error(`No ride with ID : ${id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        // if it's already cancelled don't accept it
        if(existingRide.ride_status=="cancelled"){
            res.status(403); 
            throw new Error("Ride Cancelled",{cause:RideError.RIDE_CANCELLED})
        }
        // if it's already accepted don't accept it 
        if(existingRide.ride_status!="proposed"){
            res.status(403); 
            throw new Error("Ride Accepted", {cause:RideError.RIDE_ACCEPTED})
        }

        // check if the driver is acutally free 
        const isUserAlreadyOnAnotherRide = await db.ride.findFirst({
            where:{
                driver_licence_id:req.user!?.id,
                ride_status:{
                    in:["accepted","progress"]
                }
            }
        })
        if(isUserAlreadyOnAnotherRide){
            res.status(403)
            throw new Error("Can not accept ride since you're already on one"); 
        }

        let existing_car:Car|undefined; 
        if(car_id){
            const car= await db.car.findFirst({
                where:{car_id:car_id,driver:{licence_id:req.user!?.id}}, 
            }); 
            if(!car){
                throw new Error("Car doesn't exist",{cause:RideError.CAR_NOT_EXISTS})
            }
            existing_car = car as Car ; 
        }


        const updated_ride = await db.ride.update({
            where:{
                id, 
            }, 
            data:{
                isAccepted:true, 
                accepted_at:new Date(),
                ride_status:"accepted",
                driver:{
                    connect:{
                        licence_id:req.user?.id!,
                    }
                },
                car:{
                    connect:{
                        car_id:existing_car?existing_car.car_id : req.user!?.driver!?.cars[0].car_id
                    }
                }
            }, 
            include:includeRide(req.user!?.id)
        }); 
       
        //! SEND SOCKET TO :  User 
        const {user} = updated_ride
        await user_events.notify_ride_status({user_ids:user.id,status:"accepted",ride:updated_ride } )
        
        res.status(201).json({message:"Ride Accepted",ride:updated_ride})
    }
    catch(err:any){
        console.log(err.message,"ACCEPT_RIDE")
        errorHandler(err,res)
    }
}
const start_ride_controller = async(req:RideRequest, res:Response)=>{
    try{
        const {id} = req.params ; 
        if(!id){
            res.status(403) ;
            throw new Error("No ID specified",{cause:RideError.RIDE_NOT_FOUND}); 
        }
        const existingRide = await db.ride.findFirst({
            where:{id,driver:{licence_id:req.user?.id!}}
        })
        if(!existingRide){
            res.status(404) 
            throw new Error(`No ride with ID : ${id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        if(existingRide.ride_status!="accepted"){
            res.status(403); 
            const status = existingRide.ride_status
            const {message,cause} =  
                status=="cancelled"
                ? {message:"Ride Cancelled",cause:RideError.RIDE_CANCELLED}
                : status=="finished"
                    ? {message:"Ride Finished ",cause:RideError.RIDE_FINISHED}
                    : status=="progress"
                        ?   {message:"Ride Started",cause:RideError.RIDE_PROGRESS}
                        :   {message:"Ride Not Accepted",cause:RideError.RIDE_PROPOSED}
            ; 
            throw new Error(message,{cause})
        } 
        const isRideAfterStartTime = new Date()> new Date(existingRide.starting_at! as any) ;        
        if(!isRideAfterStartTime){
            res.status(403); 
            throw new Error("Too early to start",{cause:RideError.RIDE_EARLY})
        }
        // if it's not cancelled and accepted then make Ride Status : progress 
        const updated_ride = await db.ride.update({
            where:{
                id, 
            }, 
            data:{
                starting_at:new Date(),
                ride_status:"progress",
                driver:{
                    connect:{
                        licence_id:req.user?.id!,
                    }
                },
            }, 
            include:includeRide(req.user!?.id)
            
        }); 
       
        //! SEND SOCKET TO :  User 
        const {user} = updated_ride
        await user_events.notify_ride_status({user_ids:user.id,status:"progress",ride:updated_ride})   
             
        res.status(201).json({message:"Ride on Progress",ride:updated_ride})
    }
    catch(err:any){
        console.log(err.message,"STARTED_RIDE")
        errorHandler(err,res)
    }
}


const deleteBodySchema = z.object({
    cause_cancellation: z.string().min(10).optional(), 
}) 

interface DeleteRideRequest extends Request{
    body: z.infer<typeof deleteBodySchema> ,
    params:{
        id:string
    }
}
const cancel_ride_controller = async(req:DeleteRideRequest, res:Response)=>{
    try{
        const schema = deleteBodySchema.parse(req.body)
        const {id} = req.params ; 
        if(!id){
            res.status(403) ;
            throw new Error("No ID specified",{cause:RideError.RIDE_NOT_FOUND}); 
        }
        // if the person reaching this api is the driver/the passanger 
        const existingRide = await db.ride.findFirst({
            where:
            "DRIVER" == req.user?.role!
                ?{id,driver:{licence_id:req.user?.id!} }
                :{id,user:{id:req.user?.id}}
            , 
            include:{
                driver:true
            }
        })
        if(!existingRide){
            res.status(404) 
            throw new Error(`No ride with ID : ${id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        if(existingRide.ride_status=="cancelled" ||existingRide.ride_status=="finished"){
            res.status(403); 
            const {message,cause} = 
                existingRide.ride_status=="cancelled"
                ?   {message:"Ride Cancelled",cause:RideError.RIDE_CANCELLED}
                :   {message:"Ride Finished",cause:RideError.RIDE_FINISHED}
            throw new Error(message,{cause})
        }
      
        const cancelled_ride = await db.ride.update({
            where:{
                id, 
            }, 
            data:{
                isCancelled : true , 
                cause_cancellation: schema.cause_cancellation?.trim()??undefined , 
                isCancelledByDriver: req.user?.role =="DRIVER", 
                payment_status: 
                    existingRide.payment_type=="cash"
                    ?   "cancelled"
                    :   (existingRide.payment_status=="succeeded"||existingRide.payment_status=="refunded")
                        ?   existingRide.payment_status
                        :   "cancelled",
                ride_status:"cancelled",
            }, 
            include:includeRide(req.user!?.id)
        }); 
        const {user,driver} = cancelled_ride
        await user_events.notify_ride_status({user_ids:driver?[user.id,driver.licence_id]:user.id,status:"cancelled",ride:cancelled_ride})   

        
        res.status(201).json({message:"Ride Cancelled",ride:cancelled_ride})
    }
    catch(err:any){
        console.log(err.message,"CANCEL_RIDE")
        errorHandler(err,res)
    }
}
interface ValidateRideRequest extends Request{
    params:{
        id:string
    }
}
const end_ride_controller = async(req:ValidateRideRequest, res:Response)=>{
    try{
        const {id} = req.params ; 
        if(!id){
            res.status(403);
            throw new Error("No ID specified",{cause:RideError.RIDE_NOT_FOUND}); 
        }
        // if the driver is the person reaching out the endpoint 
        const existingRide = await db.ride.findFirst({
            where:{id,driver:{licence_id:req.user?.id!}}, 
            include:{
                user:true
            }
        })
        if(!existingRide){
            res.status(404) 
            throw new Error(`No ride with ID : ${id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        // if it's cancelled you can't do anything
        if(existingRide.ride_status!="progress"){
            res.status(403); 
            const status = existingRide.ride_status
            const {message,cause} =  
                status=="cancelled"
                ? {message:"Ride Cancelled",cause:RideError.RIDE_CANCELLED}
                : status=="finished"
                    ? {message:"Ride Finished ",cause:RideError.RIDE_FINISHED}
                    : status=="accepted"
                        ?   {message:"Ride Accepted but not started",cause:RideError.RIDE_ACCEPTED}
                        :   {message:"Ride Proposed",cause:RideError.RIDE_PROPOSED}
            ; 
            throw new Error(message,{cause})
        }
      
        //! Socket to User 
        // socket.emit("finished-trip:")



        const updated_ride = await db.ride.update({
            where:{
                id, 
            }, 
            data:{
                payment_status:existingRide.payment_type=="cash"?"succeeded":existingRide.payment_status,
                ride_status:"finished", 
                arrived_at : new Date()
            }, 
            include:includeRide(req.user!?.id)
        }); 
        await user_events.notify_ride_status({user_ids:updated_ride.user.id,status:"finished",ride:updated_ride})   

        res.status(201).json({message :"Ride Finished",ride:updated_ride})
    }
    catch(err:any){
        console.log(err.message,"FINISHED_RIDE")
        errorHandler(err,res)
    }
}
export{ accept_ride_controller , cancel_ride_controller , end_ride_controller, start_ride_controller}