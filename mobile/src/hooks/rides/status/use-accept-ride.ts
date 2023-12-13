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
type Props = {
    car_id ?: string 
}
// cancel ride
type DataResponse = {
    message: string , 
    ride: Ride, 
    error?:{message:string}

} 
interface useAcceptRideType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
    mutate : UseMutateFunction<Props, unknown, any ,unknown>
    mutateAsync : UseMutateAsyncFunction<Props, unknown, any, unknown>

}   
const useAcceptRide= ()=>{
    const {user} = useAuth(); 
    const {ride,set_ride} = useRideStore();
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading,mutate:accept,mutateAsync:acceptAsync}:useAcceptRideType= useMutation({
        mutationKey:["rides","ride","ride","accept",ride?.id??""], 
        mutationFn:async(customData:Props|void)=>{
            const {car_id} = customData|| {};
            const response = await axios.put(`${SERVER_URL}/rides/ride/accept/${ride?.id??""}`,{car_id:car_id??undefined},config)
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
        accept, 
        acceptAsync
    }
}
export {useAcceptRide}