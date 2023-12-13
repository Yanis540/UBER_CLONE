import { useEffect } from "react";
import { useAuth, useSocketStore } from "../../context/store"
import {io} from 'socket.io-client'
import { SERVER_URL } from "../../env";



const useSockets = ()=>{
    const {user} = useAuth(); 
    const {socket,set_socket}= useSocketStore(); 

    useEffect(()=>{
        if(!user?.tokens)
            return ;
        if(socket?.connected)
            return ; 
        const newSocket =io(SERVER_URL,{
            withCredentials:true,
            extraHeaders:{
                Authorization:`Bearer ${user?.tokens.access.token}`
            },
            query:{
                userId:user.id
            }
        });
        if(!newSocket)
            return ; 
        newSocket.userId=user.id;
        set_socket(newSocket)
        return ()=>{
            newSocket.close(); 
            set_socket(undefined)
        }

    },[])
}

export {
    useSockets
}