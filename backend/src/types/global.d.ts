
import { JwtPayload } from "jsonwebtoken"; 
import {Request, Express} from "express"
import Stripe from "stripe";
import { Car, Driver, Prisma, Rating, User } from "@prisma/client";
import {Server, Socket} from 'socket.io'
export {}; 

declare module "jsonwebtoken"{
    interface JwtPayload{
        id: string 
    }
}
declare module "socket.io"{
    interface Socket {
        user? : User & {driver:Driver|null}
    }
    interface Server {
        drivers : UserDriver []
    }
}
declare module "express"{
    interface Request {
        user ? : UserDriver
        io ?: Server
    }
    interface Express {
        io :  Server
    }
}
declare global {
    type ListenSocketEvents = "driver:localisation"|"user:track-drivers" |"user:untrack-driver"|"driver:is-available"|"disconnect"
    type EmitSocketEvents = "driver:localisation"|"user:connection"|"driver:is-available"|"driver:disconnected"|"driver:ride-proposed"|"user:ride"
    type RideWithPaymentAndDriver = Prisma.RideGetPayload<{
        include:{
            driver:true , 
            payment_intent:{
                include:{
                    stripe_payment_intent:true 
                }
            }
        };
    }>
    type UserDriver = User& {
        driver ?:
            (
                Driver &{
                    cars:Car[]
                }
            )|null 
    }

    type RideWithFull = Prisma.RideGetPayload<{
        include:{
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
                    ratings:true,
                    _count:{
                        select:{
                            comments:true, 
                            ratings : true
                        }, 
                    }
                },
                
            }
        };
    }>
    interface ErrorInstance extends TypeError {
        cause ?:string 
    
    }
    namespace globalThis {
        var stripe_instance : Stripe ; 
    }
    namespace PrismaJson {
        // or you can use classes, interfaces, object types, etc.
        type Point = {
            longitude: number;
            latitude: number;
        };
    }
    type Point = {
        longitude: number;
        latitude: number;
    };
    interface StripePaymentIntentResult {
        paymentIntent:Stripe.PaymentIntent, 
        ephemeralKey:Stripe.EphemeralKey,
        customer:Stripe.Customer
    } 
}