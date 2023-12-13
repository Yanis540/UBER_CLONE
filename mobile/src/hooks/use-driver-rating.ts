

import { UseMutateAsyncFunction, UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { SERVER_URL } from "../env"
import { useEffect } from "react"
import { useAuth, useDriverStore, useRideStore } from "../context/store"
import { useNavigation } from "../routes"
import {z} from "zod"
import { useToast } from "react-native-toast-notifications"
const ratingSchema=  z.number().min(1).max(5); 

type RatingSchema = z.infer<typeof ratingSchema>

type PropsType = {
    type: "add" 
    rating : RatingSchema 
} | {
    type:"remove"
    rating ? : undefined
}

type DataResponse ={
    message : string 
    driver : Driver 
    new_ratings : Rating[]  
    error ?:{message:string}
}

interface  useDriverRatingType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, PropsType, unknown>
}


const useDriverRating = (id:string,update:(driver:Driver)=>void)=>{
    const {user,set_ratings} = useAuth();
    const toast = useToast(); 
    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const {data,isLoading,error,mutate:rate}:useDriverRatingType  = useMutation({
        mutationKey:["drivers",'rate',id], 
        mutationFn:async({rating,type}:PropsType)=>{
            const response = 
                type=="add" 
                ?   await axios.put(SERVER_URL+`/drivers/rate/${id}`,{rating},config)
                :   await axios.delete(SERVER_URL+`/drivers/rate/${id}`,config)
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
            toast.show(data.message,{type:"success"})
            if(data.driver){
                update(data.driver as Driver)
            }
            if(data.new_ratings){
                set_ratings(data.new_ratings)
            }
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
    }); 

    return {
        data:{
            driver: data?.driver ?? undefined, 
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 

        },
        rate  ,
        isLoading,
        error
    }
}

export {
    useDriverRating
}

