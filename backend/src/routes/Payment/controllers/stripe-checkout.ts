// import { Basket, DefaultRequest, ProductBasket } from "../../../types";
// import { Response } from "express";
// // import { Category } from "@prisma/client";
// import { db } from "../../../libs/db";
// import {z} from "zod"
// import Stripe from "stripe";
// // import { calculateTotal } from "../../../utils";
// // import { basketSchema } from "../../../schemas";
// const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET)
// const payementBodySchema = z.object({
//     basket:basketSchema
// })
// interface RequestGet extends DefaultRequest {
//     body:z.infer<typeof payementBodySchema>
// }
// // const try_product:ProductBasket = {
// //     id: "20a0b09f-4fcb-48e7-a819-a2394638af0a", 
// //     name: "Black Shirt",
// //     image:"https://cdn.shopify.com/s/files/1/0752/6435/products/IMG_0166_2fea8735-d493-49c3-8b4c-8e4392dc2ce4.jpg?v=1668772433",
// //     price: 10,
// //     quantity: 10, 
// //     color:"black",
// //     categories : [
// //         { name: 'T-shirts'}, 
// //         { name: 'Men'}, 
// //     ]
// // }


// export const stripeCheckout = async(req:RequestGet,res:Response)=>{
//     try{
//         basketSchema.parse(req.body); 
//     }
//     catch(err:any){
//         res.status(401);
//         throw new Error("Invalid Schema");
//     }
//     const {basket} = payementBodySchema.parse(req.body)
//     const checkoutSession  = await stripe.checkout.sessions.create({
//       mode:"payment",
//       payment_method_types:["card"],
//       success_url:`http://localhost:3000/checkout?success=true&sessionId={CHECKOUT_SESSION_ID}`, 
//       cancel_url:`http://localhost:3000/checkout?cancel=true&sessionId={CHECKOUT_SESSION_ID}`, 
//       line_items:basket.map((product)=>({
//         price_data:{
//           currency:"usd", 
//           product_data:{
//             name:product.name,
//             images:[product?.image??''],
//           },
//           unit_amount:product.price*100 
//         },
//         quantity:product.quantity
//       })
//       )
//     })
//     console.log(checkoutSession)

    
//     res.status(200).json({checkoutSession:checkoutSession})
// }

