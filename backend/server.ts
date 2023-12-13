import {config} from "dotenv";
config()

import express,{Request, Response, Express} from "express"; 
import { errorMiddleware } from "./src/middlewares/error";
import authRouter from "./src/routes/Auth"
import userRouter from "./src/routes/User"
import driverRouter from "./src/routes/Driver"
import commentsRouter from "./src/routes/Comments"
import ridesRouter from "./src/routes/Ride"
import paymentRouter from "./src/routes/Payment"
import {Server} from 'socket.io'
import http from "http"
import cors from "cors";
import { ioMiddleware } from "./src/middlewares/socket/io/io-middleware";
import { useSocketIO } from "./src/sockets/io";
import { authUser } from "./src/middlewares/auth";
import { push } from "./src/libs/expo";
require("express-async-errors")

const app = <Express>express();
const server=http.createServer(app)
export const io=new Server(server,{
    cors:{
        origin:process.env.CLIENT_URL!,
        methods:['GET','POST','DELETE','PUT','PATCH'],
        credentials:true
    }
})

const PORT = process.env.PORT || 5000; 
app.io = io 


useSocketIO()

app.use(ioMiddleware)
app.use(cors({origin:[process.env.CLIENT_URL!]}))
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({extended:false}));


app.get('/',authUser,async(req:Request, res:Response)=>{
    const pushNotif = await push.sendPushNotifications([
        {
            to :[req.user!?.push_token_value! ], 
            options:{
                data:{
                    event:"ride", 
                    body:{
                        id:"068e2a16-1bd3-438a-92c5-699db0966e40"  
                    }, 
                },
                title:"Nhabak",
                subtitle:"bzf", 
                body:"Hello world "
            }
        }
    ])
    res.json({message:"Hello"})
})

app.use("/auth",authRouter)
app.use("/user",userRouter)
app.use("/rides",ridesRouter)
app.use("/drivers",driverRouter)
app.use("/comments",commentsRouter)
app.use("/payment",paymentRouter)


app.use(errorMiddleware)


// app.listen(PORT,()=>console.log(`Server Running on PORT ${PORT}`))
server.listen(PORT, ()=>console.log(`Server running on PORT ${PORT}`));











