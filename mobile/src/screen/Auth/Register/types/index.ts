import {z} from "zod"
import validator from "validator";

export const registerSchema = z.object({
    name : z.string(), 
    email :z.string().email(), 
    password : z.string(), 
    confirmPassword: z.string(), 
    address : z.string().optional(), 
    photo : z.string().url().optional(),
    phone_number: z.string().refine(validator.isMobilePhone) 
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
})


export type RegisterSchema = z.infer<typeof registerSchema>