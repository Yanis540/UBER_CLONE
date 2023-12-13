import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    useMutation,
    UseMutateFunction, UseMutateAsyncFunction, 
    useQueryClient,
    useQuery,
  } from '@tanstack/react-query'
import { useEffect } from "react"
import { useToast } from "react-native-toast-notifications"
import { SERVER_URL } from "../../env"
import { useAuth , useDriverStore, useRideStore, useSocketStore } from "../../context/store"
import { useRefresh } from "../use-refresh"
type DataResponse = {
    ride: Ride, 
    error?:{message:string}
} 
interface useRideType  {
    data ?:{
        ride: Ride, 
        error?:{message:string}
    } 
    error : unknown
    isLoading : boolean 
    // mutate : UseMutateFunction<any, unknown, any ,unknown>
    // mutateAsync : UseMutateAsyncFunction<any, unknown, any, unknown>

}   
const useRide= (id:string)=>{
    const {user} = useAuth(); 
    const {socket} = useSocketStore(); 
    const {ride:rideStore,set_ride} = useRideStore(); 
    const queryClient = useQueryClient(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading}:useRideType= useQuery({
        queryKey:["rides",id], 
        queryFn:async()=>{
            const response = await axios.get(`${SERVER_URL}/rides/${id}`,config)
            const data = await response.data
            return data;
        }, 
        onSuccess:(data)=>{
            if(data?.ride as Ride)
                set_ride(data?.ride!); 
            
        }, 
        onError:(err)=>{
            if(err instanceof AxiosError){
                return toast.show(
                    err?.response?.data?.error?.message
                    ?   err?.response?.data?.error?.message
                    :   err.status == 401 ? "Unauthorized" : "Internal Server Error please try again",
                    {type:"danger"})
            }
            toast.show("Unexpected error",{type:"danger"})
        }
       
    })


    useUpdateRideSockets()

    const refresh = ()=>queryClient.invalidateQueries({queryKey:["rides",id]})
    const [refreshing,onRefresh] = useRefresh(refresh); 

  


    return {
        data:{
            ride: data?.ride?data.ride:undefined,
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        }, 
        error,
        isLoading,
        refreshing,onRefresh
    }
}
 


const useUpdateRideSockets =()=>{
    const {socket} = useSocketStore(); 
    const {ride: rideStore,set_ride} = useRideStore();
    useEffect(()=>{
        if(!socket)
            return ;
        socket.on("user:ride",({ride}:{ride:Ride})=>{
            if(rideStore?.id == ride?.id )
                set_ride(ride)
        })

        return ()=>{
            socket.off("user:ride")
            socket.removeAllListeners("user:ride")
        }
    },[socket])
}


// change payment method 




export {useRide}