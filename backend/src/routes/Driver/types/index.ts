import { RideStatus } from "@prisma/client";

export enum DriverError {
    DRIVER_NOT_FOUND = "DRIVER_NOT_FOUND", 
    DRIVER_IS_SAME_TO_COMMENT = "DRIVER_IS_SAME_TO_COMMENT", 
    USER_DID_NOT_RIDE_WITH_DRIVER = "USER_DID_NOT_RIDE_WITH_DRIVER", 
    DRIVER_NOT_RATED = "DRIVER_NOT_RATED", 
}

export const includeDriver =(user_id:string)=>({
    user : {
        select:{
            id : true, 
            name:true , 
            email : true , 
            address:true , 
            photo : true,
            created_at : true ,  
            phone_number:true , 
            localisation: true, 
            hashedPassword:false , 
        }
    },
    cars:{
        include:{
            _count:{
                select:{rides:true}
            }, 
        }, 
        orderBy:{
            rides:{
                _count:"desc" as any
            }
        }
    },
    ratings :{
        where:{
            user_id:user_id,
        }
    },
    _count:{
        select:{
            comments:true, 
            ratings : true, 
            rides:{
                where:{
                    ride_status: "finished" as RideStatus
                }
            }
        }, 
    }
})