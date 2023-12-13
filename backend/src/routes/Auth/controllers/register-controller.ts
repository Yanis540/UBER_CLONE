import {  Request as ExpressRequest,Response } from "express";
import {z} from "zod"
import bcrypt from "bcrypt"
import { db } from "../../../libs/db";
import { errorHandler } from "../../../util";
import {CarType, Role} from "@prisma/client"
import validator from "validator";
const authSchema = z.object({
    name : z.string(), 
    email :z.string().email(), 
    password : z.string(), 
    confirmPassword: z.string(), 
    address : z.string().optional(), 
    photo : z.string().url().optional(),
    phone_number: z.string().refine(validator.isMobilePhone) 
})
const registerSchema = authSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
})


type UserRegisterSchema = z.infer<typeof registerSchema>
interface UserRequest extends ExpressRequest {
    body:UserRegisterSchema
}

const register_user_controller = async(req:UserRequest,res:Response)=>{
    try{
        const {name,email,password, phone_number,address, photo} = registerSchema.parse(req.body);
        const existingUser= await db.user.findFirst({where:{email}})
        
        if(existingUser){
            res.status(401);
            throw new Error("Existing User",{cause:"EXISTING_USER"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = await db.user.create({
            data:{
                email,name,hashedPassword, phone_number , 
                address: address, 
                photo : photo , 
            }
        }); 
        res.status(201).json({message:"User created!"})
    }
    catch(err:any){
        console.log(err.message,"ERROR_REGISTER")
        errorHandler(err,res)
    }
}

const driverSchema = authSchema.extend({
        licence_id : z.string(), 
        car : z.object({
            car_id : z.string(), 
            car_type : z.enum([CarType.standard,CarType.premium,CarType.family,CarType.suv]).optional(), 
            car_model : z.string(), 
            registration_date : z.date().optional()
        })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // path of error
    })
; 
type DriverRegisterSchema = z.infer<typeof driverSchema >
interface DriverRequest extends ExpressRequest {
    body:DriverRegisterSchema
}
const register_driver_controller = async(req:DriverRequest,res:Response)=>{
    try{
        const schema = driverSchema.parse(req.body); 
        const existingUser = await db.user.findFirst({
            where:{email: schema.email}
        }); 
        if(existingUser){
            res.status(401);
            throw new Error("Existing User",{cause:"EXISTING_USER"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(schema.password,salt);
        const driver = await db.user.create({
            data:{
                id: schema.licence_id , 
                name: schema.name , 
                email : schema.email , 
                address: schema.address, 
                photo : schema.photo , 
                isValid : true , 
                hashedPassword: hashedPassword , 
                role : Role.DRIVER, 
                phone_number : schema.phone_number , 
                driver :{
                    create:{
                        isAvailable:false, 
                        total_rating :0, 
                        cars :{
                            create:{
                                car_id: schema.car.car_id, 
                                car_type : schema.car.car_type??CarType.standard,
                                car_model : schema.car.car_model,
                                registration_date : schema.car.registration_date,
                            }
                        }
                    }
                }
            }, 
            include:{
                driver:true 
            }
        }); 
        res.status(201).json({message:"Driver created!"})
    }
    catch(err:any){
        console.log(err.message, "ERROR_REGISTER_DRIVER"); 
        errorHandler(err,res);
    }
}

export{ register_user_controller, register_driver_controller}