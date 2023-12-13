import {useEffect} from "react"
import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    useMutation,
    UseMutateFunction, UseMutateAsyncFunction, 
    useQueryClient,
  } from '@tanstack/react-query'
import { useToast } from "react-native-toast-notifications"
import { useAuth  ,  useRideStore} from "../../../context/store"
import { SERVER_URL } from "../../../env"

// cancel ride
type DataResponse = {
    message: string , 
    ride: Ride, 
    error?:{message:string}

} 
interface useCancelRideType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
    mutate : UseMutateFunction<any, unknown, any ,unknown>
    mutateAsync : UseMutateAsyncFunction<any, unknown, any, unknown>

}   
const useCancelRide= ()=>{
    const {user} = useAuth(); 
    const {ride,set_ride,cancelling} = useRideStore();
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading,mutate:cancel,mutateAsync:cancelAsync}:useCancelRideType= useMutation({
        mutationKey:["rides","ride","ride","cancel",ride?.id??""], 
        mutationFn:async({cause_cancellation}:{cause_cancellation:string})=>{
            const response = await axios.put(`${SERVER_URL}/rides/ride/cancel/${ride?.id??""}`,{cause_cancellation},config)
            const data = await response.data
            return data;
        }, 
        onError:(err)=>{
            if(err instanceof AxiosError){
                return toast.show(
                    err?.response?.data?.error?.message
                    ?   err?.response?.data?.error?.message
                    :   err.status == 401 ? "Unauthorized" : "Internal Server Error please try again",
                    {type:"danger",placement:"bottom"})
            }
            toast.show("Unexpected error",{type:"danger",placement:"bottom"})
        }, 
        onSuccess:(data)=>{
            toast.show(data.message,{placement:"bottom",type:"success"})
            if(data.ride)
                set_ride(data.ride)
        }, 
    })
    useEffect(()=>{
        cancelling(isLoading)
    },[isLoading])

    
    return {
        data:{
            ride: data?.ride?data.ride:undefined,
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 

        }, 
        error,
        isLoading,
        cancel:(message?:string)=>cancel({cause_cancellation:message}), 
        cancelAsync
    }
}
export {useCancelRide}