import { Socket} from 'socket.io'
import { authUserSocket } from './middlewares/auth-socket-io'
import { db } from '../../libs/db'
import { io } from '../../../server'
import { includeDriver } from '../../routes/Driver/types'


const useSocketIO = ()=>{
    io.drivers=[];
    io
    .use(authUserSocket)
    .on('connection',(socket:Socket)=>{
        console.log(socket.user?.name," joined") 
        socket.emit<EmitSocketEvents>("user:connection",{message:"HI"})
        if(socket.user?.role=="DRIVER" && socket.user!.driver){
            // if he's not in the list we shall add him and by default he's avaialable 
            if(!(io.drivers.some((driver)=>driver.id == socket.user?.id)))
                io.drivers.push({
                    ...socket.user,
                    hashedPassword:null,
                    driver:{
                        ...socket.user.driver,
                        isAvailable:socket.user.driver.isAvailable,
                        cars:[]
                    }
                }); 
        }
        if(socket.user)
            socket.join(socket.user.id)
        // driver available 
        socket?.on<ListenSocketEvents>("driver:is-available",async({isAvailable}:{isAvailable:boolean})=>{
            try{
                if(socket?.user?.role!="DRIVER"|| ! socket.user!.driver)
                    return ; 
                io.drivers = io.drivers.map((user_driver)=>
                    user_driver.id  != socket.user!.id
                    ?   user_driver
                    :   ({
                            ...user_driver,
                            driver:{
                                ...user_driver.driver , 
                                isAvailable:isAvailable 
                            }
                        } as UserDriver
                    )
                );
                const updated_user = await db.user.update({
                    where:{id:socket.user!.id},
                    data:{
                        driver:{
                            update:{
                                isAvailable:isAvailable
                            }
                        }
                    }, 
                    include:{
                        driver:{
                            include:includeDriver(socket.user.id)
                        }
                    }
                    
                }); 
                socket.user = updated_user;
                if(isAvailable)
                    return;  
                io.to(socket.user.id).emit<EmitSocketEvents>("driver:disconnected",{driver : updated_user.driver,isAvailable})
            }
            catch(err:any){
            }
        }); 
        //  sending location  
        socket?.on<ListenSocketEvents>("driver:localisation",async({localisation}:{localisation:Point})=>{
            try{
                if(! socket.user || socket?.user?.role!="DRIVER")
                    return ;
                const updated_user = await db.user.update({
                    where:{id:socket.user.id},
                    data:{
                        localisation:{
                            longitude:localisation?.longitude,
                            latitude:localisation?.latitude
                        },
                        driver:{
                            update:{
                                isAvailable:true
                            }
                        }
                    }, 
                    include:{
                        driver:{
                            include:includeDriver(socket.user.id)
                        }
                    }
                });
                socket.user = updated_user;
                io.drivers = io.drivers.map(
                    (user_driver)=>user_driver.id != socket.user!.id
                    ?   user_driver
                    :   {...user_driver,localisation,driver:{...user_driver.driver,isAvailable:true}} as UserDriver
                );
                io.to(socket.user?.id).emit<EmitSocketEvents>("driver:localisation",{driver:updated_user.driver,localisation})
            }
            catch(err:any){
                console.log("err",err?.message)
            }
        }); 

        socket?.on<ListenSocketEvents>("user:track-drivers",({drivers_ids}:{drivers_ids:string[]})=>{
            console.log(socket?.user?.name ," tracking drivers : ",drivers_ids)
            if(!socket.user)
                return ; 
            socket.join(drivers_ids)
        })
        socket?.on<ListenSocketEvents>("user:untrack-driver",({id}:{id:string})=>{
            socket.leave(id); 
        })
        // driver removed
        socket?.on<ListenSocketEvents>("disconnect",async()=>{
            try{

                if(!socket?.user || socket?.user?.role!="DRIVER")
                    return  ; 
                io.drivers = io.drivers.filter((driver)=>driver.id != socket.user!.id)
                await db.driver.update({
                    where:{licence_id:socket.user.id}, 
                    data:{
                        isAvailable:false, 
                    }
                }) 
                // tell other 
                io.to(socket.user?.id).emit<EmitSocketEvents>("driver:disconnected",{id:socket.user.id})
                if(socket?.user)
                    socket.leave(socket.user.id)
            }
            catch(err:any){

            }
            
        })
    })
}

export { useSocketIO}