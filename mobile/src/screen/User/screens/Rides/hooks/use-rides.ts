import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    useMutation,
    UseMutateFunction, UseMutateAsyncFunction, 
    useQueryClient,
    useQuery,
  } from '@tanstack/react-query'
import { useEffect } from "react"
import { useToast } from "react-native-toast-notifications"
import { SERVER_URL } from "../../../../../env"
import { useAuth, useSocketStore } from "../../../../../context/store"
import { useRefresh } from "../../../../../hooks"
import { handleErrorMessage } from "../../../../../util/error"
type PropsType = {
    ride_status : RideStatus[]
}
type DataResponse = {
    rides: Ride[], 
    error?:{message:string}

} 

interface useRidesType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean
    mutate:UseMutateFunction<PropsType, unknown, any, unknown>
    mutateAsync:UseMutateAsyncFunction<PropsType, unknown, any, unknown>
}   
const useRides= ()=>{
    const {socket} = useSocketStore(); 
    const {user} = useAuth(); 
    const queryClient = useQueryClient(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading,mutate,mutateAsync}:useRidesType= useMutation({
        mutationKey:["rides"], 
        mutationFn:async(props?: PropsType)=>{
            const response = await axios.put(SERVER_URL+'/rides',{ride_status : props?.ride_status?.length ? props.ride_status : undefined},config)
            const data = await response.data
            return data;
        }, 
        onError:(err: any)=>{
            const errorMessage = handleErrorMessage(err); 
            toast.show(errorMessage,{type:"danger"})
        }
       
    })
    const refresh = (props?: PropsType)=>mutate(props)
    const [refreshing,onRefresh] = useRefresh(refresh); 
    
    useEffect(()=>{
        mutate({})
    },[])

    useEffect(()=>{
        if(!socket)
            return ; 
        socket.on("user:ride",({ride}:{ride:Ride})=>{
            refresh()
        }); 
        return ()=>{
            socket.off("user:ride"); 
            socket.removeAllListeners("user:ride")
        }
    },[socket])
 
    return {
        data:{
            rides: data?.rides?data.rides:[],
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 

        }, 
        error,
        isLoading,
        refreshing,onRefresh, 
        refresh
    }
}



export {useRides}