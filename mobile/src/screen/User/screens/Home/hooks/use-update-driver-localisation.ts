import { useEffect } from "react";
import { useSocketStore } from "../../../../../context/store";
import { useQueryClient } from "@tanstack/react-query";



export const useUpdateDriverLocalisation = ()=>{
    const {socket} = useSocketStore(); 
    const queryClient = useQueryClient(); 
    useEffect(()=>{
        if(!socket)
            return ; 
        socket.on<ListenSocketEvents>("user:connection",()=>console.log("Socket Connection established")); 
        socket.on<ListenSocketEvents>("driver:localisation",({driver,localisation}:{driver:Driver,localisation:Point})=>{
            queryClient?.setQueryData(["drivers","nearby"],(prev:any)=>{
                if(!prev?.drivers)
                    return prev ;
                const updated_drivers = (prev.drivers as Driver[]).map((prevDriver)=>
                    prevDriver.licence_id !=driver.licence_id
                    ?   prevDriver 
                    :   driver 
                ) 
                return {
                    ...prev,
                    drivers : updated_drivers 
                }
            })
        })
        socket.on<ListenSocketEvents>("driver:disconnected",({id}:{id:string})=>{
            // updated the state 
            queryClient?.setQueryData(["drivers","nearby"],(prev:any)=>{
                if(!prev?.drivers)
                    return prev ;
                const updated_drivers = (prev.drivers as Driver[]).filter((driver)=>driver.licence_id!=id)
                return {
                    ...prev,
                    drivers : updated_drivers 
                }
            }); 
            // leaving the socket in the background 
            socket.emit<EmitSocketEvents>("user:untrack-driver",({id}))
        })
        return ()=>{
            socket?.off<ListenSocketEvents>("user:connection")
            socket?.off<ListenSocketEvents>("driver:localisation")
            socket?.off<ListenSocketEvents>("driver:disconnected")
        }
    },[socket])
}