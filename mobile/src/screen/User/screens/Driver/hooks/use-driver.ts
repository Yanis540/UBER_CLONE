import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    useMutation,
    UseMutateFunction, UseMutateAsyncFunction, 
    useQueryClient,
  } from '@tanstack/react-query'
import { useEffect } from "react"
import { useToast } from "react-native-toast-notifications"
import { useAuth, useDriverStore, useRideStore } from "../../../../../context/store"
import { SERVER_URL } from "../../../../../env"
import { useRefresh } from "../../../../../hooks"
type DataResponse= {
    driver: Driver, 
    error?:{message:string}
} 
interface useDriverType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
    mutate : UseMutateFunction<any, unknown, any ,unknown>
    mutateAsync : UseMutateAsyncFunction<any, unknown, any, unknown>

}   
const useDriver= (id:string)=>{
    const {user} = useAuth(); 
    const {set_driver} = useDriverStore()
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading,mutate:getDriver,mutateAsync:getAsyncDriver}:useDriverType= useMutation({
        mutationKey:["drivers",id], 
        mutationFn:async()=>{
            const response = await axios.get(`${SERVER_URL}/drivers/${id}`,config)
            const data = await response.data
            return data;
        }, 
        onSuccess:(data)=>{
            if(data.driver as Driver)
                set_driver(data.driver); 
            
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
    const refresh = ()=>getDriver({})
    const [refreshing,onRefresh] = useRefresh(refresh); 

    useEffect(()=>{
        getDriver({})
    },[])
    return {
        data:{
            driver: data?.driver?data.driver:undefined,
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        }, 
        error,
        isLoading,
        // refresh, 
        refreshing,
        onRefresh,
        getAsyncDriver, 

    }
}
export {useDriver}