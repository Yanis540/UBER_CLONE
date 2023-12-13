import { RideStatus } from "@prisma/client"

export enum RideError {
    RIDE_NOT_FOUND = "RIDE_NOT_FOUND", 
    RIDE_PAID = "RIDE_PAID", 
    RIDE_CANCELLED = "RIDE_CANCELLED", 
    RIDE_UNPAID = "RIDE_UNPAID", 
    RIDE_FINISHED = "RIDE_FINISHED", 
    RIDE_ACCEPTED = "RIDE_ACCEPTED", 
    RIDE_PROPOSED = "RIDE_PROPOSED", 
    RIDE_PROGRESS = "RIDE_PROGRESS", 
    INCORRECT_PAYMENT_METHOD = "INCORRECT_PAYMENT_METHOD", 
    CAR_NOT_EXISTS = "CAR_NOT_EXISTS", 
    INVALID_REFUND = "INVALID_REFUND", 
    RIDE_EARLY = "RIDE_EARLY", 
}

export const includeRide =(user_id:string)=> ({
    start_address:true,
    destination_address:true,
    payment_intent:{
        include:{
            stripe_payment_intent:true,
        }
    },
    car : true, 
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
    driver:{
        include:{
            
            user:{
                select:{
                    id:true, 
                    name:true,
                    email:true, 
                    photo:true, 
                    phone_number:true , 
                    hashedPassword:false, 
                    driver:false ,
                }
            }, 
            ratings:{
                where:{
                    user_id:user_id
                }
            },
            _count:{
                select:{
                    comments:true, 
                    ratings : true
                }, 
            }
        },
        
    }
})

export const includeUser = {
    rides:{
        where:{
            ride_status:{
                in : ["progress"] as RideStatus[]
            }
        }, 
        select:{
            id:true,
            ride_status: true , 
            start_address:{
                select:{
                    name:true 
                }
            }, 
            destination_address:{
                select:{
                    name:true 
                }
            }, 
        }
    },
    driver:{
        include:{
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
            rides:{
                where:{
                    ride_status:{
                        in : ["progress","accepted"] as RideStatus[]
                    }
                }
            },
            _count:{
                select:{
                    rides:true
                }
            }
        }
    },
    drivers_commented_on:{
        select:{
            licence_id:true
        }
    }, 
    ratings:{
        select:{
            rating : true,
            licence_id:true
        }
    }, 
     _count:{
        select:{
            rides:{
                where:{
                    ride_status:"finished" as RideStatus
                }
            }
        }
    }
}

export const includeComment = (driverId:string,user_id: string)=>({
    user:{
        select:{
            id:true,
            name:true, photo:true , 
            // should be 0 
            ratings:{
                where:{
                    licence_id:driverId
                }, 
                select:{
                    rating:true
                }
            }
        }
    },
    liked_by:{
        where:{
            id:user_id
        },
    },
    _count:{
        select:{
            liked_by:true
        }
    }, 
})