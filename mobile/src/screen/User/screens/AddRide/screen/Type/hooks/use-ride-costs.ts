import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    useMutation,
    UseMutateFunction, UseMutateAsyncFunction, 
    useQueryClient,
    useQuery,
  } from '@tanstack/react-query'
import { useEffect } from "react"
import { useToast } from "react-native-toast-notifications"
import { SERVER_URL } from "../../../../../../../env"
import { useRefresh } from "../../../../../../../hooks"
import { useAuth } from "../../../../../../../context/store"
type DataResponse = {
    costs : {
        car_types : ({
            type:CarType, 
            photo : string 
            price_per_km : number 
        })[]
        TRAFIC_COEF : number 
        ADDITIONAL_FEE : number 
    }
    error?:{message:string}
} 
interface useRideCostsType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
}   
const useRideCosts= ()=>{
    const {user} = useAuth(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const queryClient = useQueryClient()
    const {data,error,isLoading}:useRideCostsType= useQuery({
        queryKey:["rides","ride","costs"], 
        queryFn:async()=>{
            const response = await axios.get(`${SERVER_URL}/rides/ride/costs/`,config)
            const data = await response.data
            return data;
        }, 
        onSuccess:(data)=>{
            
        }, 
        onError:(err:any)=>{
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
    const refresh = ()=>queryClient.invalidateQueries({queryKey:["rides","ride","costs"],})
    const [refreshing,onRefresh] = useRefresh(refresh);
    
    return {
        data:{
            costs: data?.costs?data.costs:undefined,
            
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        }, 
        error,
        isLoading,
        refreshing,onRefresh
    }
}
 
export {
    useRideCosts
}