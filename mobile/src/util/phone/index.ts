import {z} from "zod"
import validator from "validator"
export const phoneNumberSchema = z.string().refine(validator.isMobilePhone).optional()



export const validatePhoneNumber = (input?:string)=>{
    const phone_number = phoneNumberSchema.safeParse(input); 
    if(phone_number.success==false){
      return  undefined; 
    }
    return phone_number.data as string; 
}