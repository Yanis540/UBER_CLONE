import { db } from "../../../libs/db";
import {Response , Request} from "express"
import { calculateDistancePoints, errorHandler } from "../../../util";
import { RideError, includeRide } from "../types";
import {z} from "zod"
import { RideStatus } from "@prisma/client";

const getRidesSchema = z.object({
    ride_status : z.array(z.enum([RideStatus.accepted,RideStatus.cancelled,RideStatus.finished,RideStatus.progress, RideStatus.proposed])).optional()
}); 

interface GetRidesRequest extends Request{
    body: z.infer<typeof getRidesSchema>
}

const get_rides_controller = async(req:GetRidesRequest,res:Response)=>{
    try{
        const bodySchema = getRidesSchema.parse(req.body); 
        const rides = await db.ride.findMany({
            where:{
                ...( req?.user!?.role !="DRIVER"
                ?   req.user?.role == "REGULAR"
                    ?   { 
                            user:{
                                id:req.user?.id!
                            }, 
                            
                        } 
                    : {}
                :   {
                        driver:{
                            licence_id: req.user?.id
                        }
                    }
                ), 
                ride_status : !bodySchema?.ride_status|| bodySchema?.ride_status.length == 0 ?{}:{
                    in:bodySchema.ride_status
                }
            }
            , 
            orderBy:[{"ordered_at":"desc"}], 
            include:includeRide(req.user!?.id)
        }); 
      res.status(201).json({rides})
    }
    catch(err:any){
        console.log(err.message,"RIDES")
        errorHandler(err,res)
    }

        // const {}
}


const getVicinityRidesForDriverBodySchema = z.object({
    localisation:z.object({
        longitude : z.number() , 
        latitude: z.number()
    }), 
    vicinities: z.array(z.string()).optional(), 
    radius : z.number().min(1).optional().default(5), // expressed in km , 
    index: z.number().min(0).optional().default(0), 
    
})
interface GetVicinityRidesForDriverRequest extends Request{
    body: z.infer<typeof getVicinityRidesForDriverBodySchema>
}

const get_vicinity_rides_for_driver= async(req:GetVicinityRidesForDriverRequest,res:Response)=>{
    try{
        const {localisation,radius=5, index= 0,vicinities} = getVicinityRidesForDriverBodySchema.parse(req.body); 
        //! 25.6 USD per 1000 request : THATS A BIG NO NO 
        // const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${localisation.latitude}%2C${localisation.longitude}&radius=${(radius*1000).toFixed()}&key=${process.env.GOOGLE_MAPS_APIKEY}`).then((res)=>res.json())
        // if(!response||response.status!="OK"){
        //     res.status(403); 
        //     throw new Error('Problem with google')
        // }
        // const vicinity_driver = (response?.results as any[])?.slice(0).map((result:any)=>result.vicinity)
        // console.log(vicinity_driver)
        const rides = await db.ride.findMany({
            where:{
                ride_status:"proposed", 
                start_address:!vicinities?{}:{
                    OR : [
                        {
                            OR : [
                                {vicinity:{in:vicinities}},
                                {name:{in:vicinities}}
                            ]
                        },
                        {
                            OR : [
                                {name:{in:vicinities}},
                                {vicinity:{in:vicinities}},
                            ]
                        },
                    ]
                   
                }, 
            }, 
            take:200,
            orderBy:[{"ordered_at":"desc"},{"total":"desc"}], 
            include:{
                start_address:true , 
                destination_address:true,
                user:{
                    select:{
                        id:true, 
                        name:true,
                        email:true, 
                        photo:true, 
                        phone_number:true ,
                        hashedPassword:false, 
                    }
                },
            }
        }); 
        const closest_rides = rides.filter((ride)=> calculateDistancePoints(localisation,ride.start_address.localisation) <= radius);
        res.status(201).json({rides:closest_rides})
    }
    catch(err:any){
        console.log(err.message,"GET_RIDES_FOR_DRIVER")
        errorHandler(err,res)
    }
}

interface GetRideRequest extends Request {
    params:{
        id:string
    }
}

const get_ride_controller = async(req:GetRideRequest, res:Response)=>{
    try{
        const {id} = req.params ; 
        if(!id){
            res.status(403) ;
            throw new Error("No ID specified",{cause:RideError.RIDE_NOT_FOUND}); 
        }
        const ride = await db.ride.findFirst({
            where:{
                id 
            }, 
            include:includeRide(req.user!?.id)
        })
        if(!ride){
            res.status(404)
            throw new Error(`No ride with id ${id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        // if(ride.ride_status=="proposed"  )
        // if (regular/admin user + matched id || driver + proposed || driver + he's the driver) 
        //      then :  you can view 
        //      otherwise : you can't view it    
        if(
            !(
                (req.user!?.role != "REGULAR" &&ride.user_id == req.user!?.id)
                || (
                    req.user!?.role=="DRIVER"&& (
                        ride.ride_status== "proposed" 
                        || ride.driver_licence_id == req.user!?.id
                    )
                ) 
            )
        ){
            res.status(404)
            throw new Error(`No ride with id ${id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        if(!ride){
            res.status(404)
            throw new Error(`No ride with id ${id}`,{cause:RideError.RIDE_NOT_FOUND})
        }
        res.status(201).json({ride:ride})
      }
      catch(err:any){
        console.log(err.message,"RIDES")
        errorHandler(err,res)
      }
}
export{ get_vicinity_rides_for_driver, get_rides_controller ,get_ride_controller}