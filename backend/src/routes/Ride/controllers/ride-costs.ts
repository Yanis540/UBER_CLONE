import { Request, Response } from "express";
import { errorHandler } from "../../../util";
import { CarType } from "@prisma/client";



const get_ride_costs= async(req:Request,res:Response)=>{
    try{
        const car_types : ({
            type:CarType, 
            photo : string 
            price_per_km : number 
        })[] =[
            {type:"standard",price_per_km:0.1,photo:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_558,h_372/v1568070387/assets/b5/0a5191-836e-42bf-ad5d-6cb3100ec425/original/UberX.png",}, 
            {type:"family",price_per_km:0.2,photo:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_583,h_328/v1568134115/assets/6d/354919-18b0-45d0-a151-501ab4c4b114/original/XL.png",}, 
            {type:"premium",price_per_km:0.3,photo:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_558,h_372/v1569012915/assets/4f/599c47-7f5c-4544-a5d2-926babc8e113/original/Lux.png",}, 
            {type:"suv",price_per_km:0.4,photo:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_558,h_372/v1569352630/assets/4b/28f11e-c97b-495a-bac1-171ae9b29362/original/BlackSUV.png",}, 
        ] 

        // find formule based on the number of the users 
        //! Higher number of users => lower traffic coef 
        //! less number of users => higher traffic coef 
        const TRAFIC_COEF = 1.1 
        const ADDITIONAL_FEE =  5 // fees for using API  
        res.status(201).json({costs : {car_types,TRAFIC_COEF,ADDITIONAL_FEE}})
    }
    catch(err:any){
        console.log(err.message,"GET_RIDES_COSTS")
        errorHandler(err,res)
    }
}
export {
    get_ride_costs
}