import { useEffect } from "react";
import { useAuth, useLocalisationStore, useSocketStore } from "../../../../context/store";


const TIME_DELAY = 5*60*1000 // 5 min 


const useDriverSockets = ()=>{
  const {socket} = useSocketStore();
  const {localisation} = useLocalisationStore()
  const {user,set_user} = useAuth() 
  useEffect(()=>{
    if(!socket)
      return ; 
    socket.on<ListenSocketEvents>("user:connection",()=>console.log("Socket Connection established")); 
    socket.on<ListenSocketEvents>("driver:is-available",({driver,isAvailable}:{driver:Driver,isAvailable?:boolean})=>{
      if(driver.licence_id!=user?.id || ! user?.driver)
        return; 
      set_user({...user,driver:{...user?.driver,isAvailable:isAvailable}})
    })
    const interval = setInterval(()=>{
      if((!localisation )|| (!user?.driver?.isAvailable))
        return ; 
      socket.emit<EmitSocketEvents>("driver:localisation",{localisation})
    },TIME_DELAY) // every 5min 
    
    return ()=>{
      socket?.off<ListenSocketEvents>("user:connection")
      socket?.off<ListenSocketEvents>("driver:is-available")
      socket?.off("driver:localisation")
      clearInterval(interval)
    }
  });
}

export {
    useDriverSockets
}