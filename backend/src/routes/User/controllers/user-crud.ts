import { z} from "zod";
import { db } from "../../../libs/db";
import {Response , Request} from "express"
import bcrypt from "bcrypt"
import { errorHandler } from "../../../util";
import { UserError } from "../types";
import { includeUser } from "../../Ride/types";
import { PaymentType } from "@prisma/client";
import { v2 as cloudinary } from 'cloudinary'

const cloudDetailsOptions = z.object({
    cloud:z.object({
        asset_id : z.string(), 
        public_id : z.string(), 
        access_mode : z.string(),
        folder : z.string(),
        resource_type : z.string(),
        secure_url : z.string(),
        signature : z.string(),
        url : z.string(), 
    })

})
const updateUserSchema = z.object({
    address: z.string().optional(), 
    name : z.string().min(4).optional(), 
    photo : 
        z.union([
            cloudDetailsOptions,
            z.string().url(),
            z.undefined(),  
        ])
    ,
    old_password : z.string().min(4).optional(), 
    new_password : z.string().min(4).optional(), 
    confirmPassword: z.string().min(4).optional(), 
    prefered_payment_type : z.enum([PaymentType.cash,PaymentType.card]).optional(), 
})
.refine((data) => data.new_password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
})

type UpdateUserSchema = z.infer<typeof updateUserSchema>
interface UpdateRequest extends Request {
    body:UpdateUserSchema
} 
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME, 
    api_key : process.env.CLOUDINARY_API_KEY, 
    api_secret : process.env.CLOUDINARY_API_SECRET, 
    secure : true, 
})
const update_user_controller = async(req:UpdateRequest,res:Response)=>{
    try{
        const schema = updateUserSchema.parse(req.body); 
        if(schema.new_password && (!schema.old_password)){
            res.status(401); 
            throw new Error("Old Password Missing ",{cause:UserError.INCORRECT_PASSWORD}); 
        }
        let hashedPassword :string| undefined; 
        if(schema.old_password && schema.new_password){
            const isMatching = await bcrypt.compare(schema.old_password, req.user?.hashedPassword!)
            if(!isMatching) {
                res.status(401); 
                throw new Error("Incorrect Password",{cause:UserError.INCORRECT_PASSWORD}) 
            }
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(schema.new_password, salt) 
        }
        if(schema.photo){

            const user= await db.user.findFirst({
                where:{id:req.user!?.id}, 
                include:{
                    cloud_photo:true
                }
            })!; 
            if(user?.cloud_photo){
                const data = await cloudinary.uploader.destroy(user.cloud_photo.public_id!); 
                if(!data ){
                    res.status(403); 
                    throw new Error("Error Updating Image",{cause:UserError.ERROR_UPDATING_IMAGE})
                }
                await db.cloudPhotoDetails.delete({
                    where:{
                        asset_id:user.cloud_photo.asset_id
                    }
                })
            }
        }
              
        const updatedUser = await db.user.update({
            where:{id: req.user?.id!} , 
            data:{
                name: schema.name?.trim()??undefined , 
                photo: 
                    !schema.photo
                    ?   undefined 
                    :   (typeof schema.photo == "string")
                        ?   schema.photo 
                        :   schema.photo.cloud.url, 
                cloud_photo:schema?.photo==undefined || (typeof schema.photo == 'string')?undefined:{
                    create:{
                        ...schema.photo.cloud
                    },
                },  
                hashedPassword: hashedPassword?? undefined , 
                address: schema?.address?.trim()??undefined, 
                prefered_payment_type : schema?.prefered_payment_type??undefined
            },
            include:includeUser

        })
        res.status(201).json({
          message:"User Updated ! ", 
          user:{...updatedUser, hashedPassword:undefined}
        })
    }
    catch(err:any){
        console.log(err.message,"UPDATE_USER")
        errorHandler(err,res)
    }

        // const {}
}


const delete_user_controller = async(req:Request,res:Response)=>{
    try{
        const updatedUser = await db.user.update({
            where:{id: req.user?.id!} , 
            data:{
                isDeleted: true
            }
        })
        res.status(201).json({
          message:"User Deleted ! "
        })
    }
    catch(err:any){
        console.log(err.message,"DELETE_USER")
        errorHandler(err,res)
    }

        // const {}
}



const get_user= async(req:Request,res:Response)=>{
    try{
        const user = await db.user.findFirst({
            where:{id: req.user?.id!} , 
            include:includeUser,
        })
        res.status(201).json({
          user:{...user,hashedPassword:undefined}
        })
    }
    catch(err:any){
        console.log(err.message,"DELETE_USER")
        errorHandler(err,res)
    }

}


const setPushNotificationsSchema = z.object({
    push_notifications_token: z.string()
})

type SetPushNotificationsSchema = z.infer<typeof setPushNotificationsSchema>
interface SetPushNotificationsRequest extends Request {
    body:SetPushNotificationsSchema
} 
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME, 
    api_key : process.env.CLOUDINARY_API_KEY, 
    api_secret : process.env.CLOUDINARY_API_SECRET, 
    secure : true, 
})
const set_push_notifications = async(req:SetPushNotificationsRequest,res:Response)=>{
    try{
        const schema = setPushNotificationsSchema.parse(req.body); 
        const updatedUser = await db.user.update({
            where:{
                id:req.user!?.id 
            }, 
            data:{
                push_token:{
                    connectOrCreate:{
                        where:{
                            token:schema.push_notifications_token
                        }, 
                        create:{
                            token:schema.push_notifications_token, 
                            user:{
                                connect:{
                                    id:req.user!?.id
                                }
                            }
                        }
                    }
                }
            }, 
            include:includeUser
        })
        res.status(201).json({
          message:"User Updated ! ", 
          user:{...updatedUser, hashedPassword:undefined}
        })
    }
    catch(err:any){
        console.log(err.message,"UPDATE_USER")
        errorHandler(err,res)
    }

        // const {}
}


const update_payment_method = async(req:Request,res:Response)=>{
    try{
        const updated_user = await db.user.update({
            where:{
                id: req.user!?.id, 
            }, 
            data:{
                prefered_payment_type: req.user!?.prefered_payment_type == "cash"?"card":"cash"
            }, 
            include:includeUser
        })
        res.status(201).json({
            message:"Payment method updated",
            user:{...updated_user,hashedPassword:undefined}
        })
    }
    catch(err:any){
        console.log(err.message,"DELETE_USER")
        errorHandler(err,res)
    }
}



export{ update_user_controller , delete_user_controller, get_user, set_push_notifications,update_payment_method}