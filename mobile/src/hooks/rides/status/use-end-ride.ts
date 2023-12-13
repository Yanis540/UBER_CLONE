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
import { handleErrorMessage } from "../../../util/error"

// cancel ride
type DataResponse = {
    message: string , 
    ride: Ride, 
    error?:{message:string}

} 
interface useEndRideType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
    mutate : UseMutateFunction<void, unknown, any ,unknown>
    mutateAsync : UseMutateAsyncFunction<void, unknown, any, unknown>

}   
const useEndRide= ()=>{
    const {user} = useAuth(); 
    const {ride,set_ride} = useRideStore();
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading,mutate:end,mutateAsync:endAsync}:useEndRideType= useMutation({
        mutationKey:["rides","ride","ride","end",ride?.id??""], 
        mutationFn:async()=>{
            const response = await axios.put(`${SERVER_URL}/rides/ride/end/${ride?.id??""}`,{},config)
            const data = await response.data
            return data;
        }, 
        onError:(err)=>{
            const errMessage = handleErrorMessage(err); 
            toast.show(errMessage,{type:"danger"})
        }, 
        onSuccess:(data)=>{
            toast.show(data.message,{placement:"bottom",type:"success"})
            if(data.ride)
                set_ride(data.ride)
        }, 
    })
 

    
    return {
        data:{
            ride: data?.ride?data.ride:undefined,
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 

        }, 
        error,
        isLoading,
        end, 
        endAsync
    }
}
export {useEndRide}