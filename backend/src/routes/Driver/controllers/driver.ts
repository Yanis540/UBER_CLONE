import { db } from "../../../libs/db";
import {Response , Request} from "express"
import { drivers_nearby, errorHandler, isNearby } from "../../../util";
import {z} from "zod"
import { DriverError, includeDriver } from "../types";
import { io } from "../../../../server";



const getDriverParamsSchema = z.object({
    id:z.string()
})

interface GetDriverRequest extends Request{
    params:z.infer<typeof getDriverParamsSchema>
}
const get_driver = async(req:GetDriverRequest,res:Response)=>{
    try{
        const {id} = getDriverParamsSchema.parse(req.params); 
        const driver = await db.driver.findFirst({
            where:{licence_id:id}, 
            include:includeDriver(req.user!?.id)
        }); 
        if(!driver){
            res.status(404); 
            throw new Error("Driver Not Found",{cause: DriverError.DRIVER_NOT_FOUND})
        }
        res.status(201).json({driver:{...driver,hashedPassword:undefined}})
    }
    catch(err:any){
        console.log(err.message,"GET_DRIVER")
        errorHandler(err,res)
    }
}

const getNearByDriversBodySchema = z.object({
    localisation : z.object({
        longitude : z.number() , 
        latitude: z.number()
    }), 
    radius: z.number().min(1).max(20).default(5).optional()
})
interface GetNearbDriversRequest extends Request {
    body : z.infer<typeof getNearByDriversBodySchema>
}

const get_drivers_nearby = async(req:GetNearbDriversRequest,res:Response)=>{
    try{
        const {localisation, radius=5} = getNearByDriversBodySchema.parse(req.body)
        const nearby_drivers_ids = drivers_nearby({radius,localisation,drivers:io.drivers??[]})
        const drivers = await db.driver.findMany({
            where:{
                licence_id:{
                    in:[...nearby_drivers_ids,]
                }
            }, 
            include:includeDriver(req.user!?.id)
        })  
        // connect to users 
        res.status(201).json({drivers})
    }
    catch(err:any){
        console.log(err.message,"GET_NEARBY_DRIVERS")
        errorHandler(err,res)
    }
}

const rateDriverBodySchema = z.object({
    rating : z.number().min(1).max(5), 
})

interface RateDriverRequest extends Request{
    body:z.infer<typeof rateDriverBodySchema>, 
    params:{
        id:string 
    }
}

const rate_driver = async(req:RateDriverRequest,res:Response)=>{
    try{
        const schema = rateDriverBodySchema.parse(req.body);
        const {id:driverId} = req.params 

        if(driverId == req.user!.id){
            res.status(403)
            throw new Error("You can't rate yourself on yourself ",{cause:DriverError.DRIVER_IS_SAME_TO_COMMENT})
        }
        const driver_user = await db.user.findFirst({
            where:{id:driverId}, 
            include:{
                driver:true,
            }
        }); 
        if(!driver_user ||!driver_user.driver || driver_user.role!="DRIVER"){
            res.status(404); 
            throw new Error("Driver Not Found",{cause: DriverError.DRIVER_NOT_FOUND})
        }
        // if user didn't ride with driver 
        const userRideWithDriver = await db.ride.findFirst({
            where:{
                user:{
                    id:req.user!?.id , 
                }, 
                driver:{
                    licence_id:driverId
                }, 
                OR : [
                    {ride_status:"finished"}, 
                    {ride_status:"cancelled"}
                ]
            }
        });
        if(!userRideWithDriver||(userRideWithDriver.ride_status!="finished" && userRideWithDriver.ride_status!="cancelled")){
            res.status(403)
            throw new Error(`Can't comment on Driver if you did not ride with him`,{cause:DriverError.USER_DID_NOT_RIDE_WITH_DRIVER})
        }; 
        // delete any previous rating ot the users 
        const alreadyRated = await db.rating.delete({
            where:{
                licence_id_user_id:{
                    user_id : req.user!?.id, 
                    licence_id: driverId, 
                }
      
            }, 
        }).catch((err)=>{
            // just to handle the case when there's no existing rating 
        })
        const rating = await db.rating.create({
            data:{
                user:{
                    connect:{
                        id:req.user!?.id 
                    }
                }, 
                driver:{
                    connect:{
                        licence_id:driverId, 
                        
                    }
                }, 
                rating:schema.rating
            }, 
            include:{
                user:{
                    include:{
                        ratings:{
                            select:{
                                rating:true,
                                licence_id:true
                            }
                        }
                    }
                },
                driver:{
                    include:{
                        // bring new ratings 
                        ratings:{
                            select:{
                                rating:true
                            }
                        }, 
                        // and count them 
                        _count:{
                            select:{
                                ratings:true
                            }
                        }
                    }
                }
            }
        }); 
        const total_rating_sum = rating.driver.ratings.reduce((current_value ,ratingObj)=>(ratingObj.rating)+current_value,0);
        
        const new_total_rating = (total_rating_sum) / (rating.driver._count.ratings)

        const updatded_driver = await db.driver.update({
            where:{
                licence_id:driverId, 
            }, 
            data:{
                total_rating:new_total_rating
            }, 
            include:includeDriver(req.user!?.id)
        }); 


       

        res.status(201).json({message:"Thank you for rating",driver:updatded_driver,new_ratings:rating.user!.ratings})
    }
    catch(err:any){
        console.log(err.message,"RATE_DRIVER")
        errorHandler(err,res)
    }

}
interface RemoveRateDriverRequest extends Request {
    params : {
        id: string 
    }
}
const remove_driver_rating = async(req:RemoveRateDriverRequest,res:Response)=>{
    try{
        const {id:driverId} = req.params 
        if(driverId == req.user!.id){
            res.status(403)
            throw new Error("You can't rate yourself on yourself ",{cause:DriverError.DRIVER_IS_SAME_TO_COMMENT})
        }
        const driver_user = await db.user.findFirst({
            where:{id:driverId}, 
            include:{
                driver:true,
            }
        }); 
        if(!driver_user ||!driver_user.driver || driver_user.role!="DRIVER"){
            res.status(404); 
            throw new Error("Driver Not Found",{cause: DriverError.DRIVER_NOT_FOUND})
        }
        // delete any previous rating ot the users 
        const deleted_rating = await db.rating.delete({
            where:{
                licence_id_user_id:{
                    user_id : req.user!?.id, 
                    licence_id: driverId, 
                }
      
            }, 
            include:{
                user:{
                    include:{
                        ratings:{
                            select:{
                                rating:true,
                                licence_id:true
                            }
                        }
                    }
                }
            }
        }).catch((err)=>{
            // just to handle the case when there's no existing rating 
            throw new Error("Driver not rated", {cause:DriverError.DRIVER_NOT_RATED})
        }); 
       
        const driver = await db.driver.findFirst({
            where:{licence_id:driverId}, 
            include:{
                ratings:{
                    select:{
                        rating : true 
                    }
                }, 
                _count:{
                    select:{
                        ratings : true 
                    }
                }
            }
        })
        const total_rating_sum = driver!.ratings.reduce((current_value ,ratingObj)=>(ratingObj.rating)+current_value,0);
        const new_total_rating = driver?._count.ratings == 0 ? 0 :  (total_rating_sum) / (driver!._count.ratings)
        const updatded_driver = await db.driver.update({
            where:{
                licence_id:driverId, 
            }, 
            data:{
                total_rating:new_total_rating
            }, 
            include:includeDriver(req.user!?.id),
        }); 
        res.status(201).json({message:"removed_rating",driver:updatded_driver,new_ratings:deleted_rating.user!.ratings})
    }
    catch(err:any){
        console.log(err.message,"REMOVE_RATE_DRIVER")
        errorHandler(err,res)
    }

}



export {
    get_driver, 
    get_drivers_nearby, 
    rate_driver, 
    remove_driver_rating
}