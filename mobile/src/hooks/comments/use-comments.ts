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
import { useAuth , useDriverStore } from "../../context/store"
import { useRefresh } from "../use-refresh"
type DataResponse = {
    comments: Comment[], 
    error?:{message:string}
} 
interface useCommentsType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
    // mutate : UseMutateFunction<any, unknown, any ,unknown>
    // mutateAsync : UseMutateAsyncFunction<any, unknown, any, unknown>

}   
const useComments= (driverId:string,index:number)=>{
    const {user} = useAuth(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const queryClient = useQueryClient()
    const {data,error,isLoading}:useCommentsType= useQuery({
        queryKey:["comments","driver",driverId], 
        queryFn:async()=>{
            const response = await axios.get(`${SERVER_URL}/comments/driver/${driverId}/?index=${index}`,config)
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
    const refresh = ()=>queryClient.invalidateQueries({queryKey:["comments","driver",driverId]})
    const [refreshing,onRefresh] = useRefresh(refresh)
    return {
        data:{
            comments: data?.comments?data.comments:[],
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        }, 
        error,
        isLoading,
        refreshing,onRefresh
    }
}
 
export {
    useComments
}