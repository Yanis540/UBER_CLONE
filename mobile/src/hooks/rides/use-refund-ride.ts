import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    useMutation,
    UseMutateFunction, UseMutateAsyncFunction, 
  } from '@tanstack/react-query'
import { useToast } from "react-native-toast-notifications"
import { useAuth, useRideStore } from "../../context/store"
import { SERVER_URL } from "../../env"
import { handleErrorMessage } from "../../util/error"
// cancel ride
type DataResponse ={
    message: string , 
    ride: Ride, 
    error?:{message:string}

} 
interface useRefundRideType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
    mutate : UseMutateFunction<any, unknown, any ,unknown>
    mutateAsync : UseMutateAsyncFunction<any, unknown, any, unknown>

}   
const useRefundRide= (id:string)=>{
    const {user} = useAuth(); 
    const {set_ride} = useRideStore()
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading,mutate:refund,mutateAsync:refundAsync}:useRefundRideType= useMutation({
        mutationKey:["rides","ride","refund",id], 
        mutationFn:async()=>{
            const response = await axios.put(`${SERVER_URL}/rides/ride/refund/${id}`,{},config)
            const data = await response.data
            return data;
        }, 
        onError:(err)=>{
            const errorMessage= handleErrorMessage(err); 
            toast.show(errorMessage,{type:"danger",placement:"bottom"})
        }, 
        onSuccess:(data)=>{
            toast.show(data.message,{placement:"bottom",type:"success"})
            if(data.ride)
                set_ride(data.ride)
        }
       
    })
    
    return {
        data:{
            ride: data?.ride?data.ride:undefined,
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 

        }, 
        error,
        isLoading,
        refund, 
        refundAsync
    }
}
export {useRefundRide}