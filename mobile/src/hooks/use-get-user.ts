

import { UseMutateAsyncFunction, UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosRequestConfig } from "axios"
import { SERVER_URL } from "../env"
import { useEffect } from "react"
import { useAuth } from "../context/store"
import { useNavigation } from "../routes"
import { useRefresh } from "./use-refresh"


interface  useGetUserType {
    error: unknown 
    data : {
        user : User 
        error ?:{message:string}
    }|undefined
    isLoading : boolean
    // mutate:UseMutateFunction<any, unknown, void, unknown>
}

const useGetUser = ()=>{
    const {user,set_user} = useAuth();
    const {navigation} = useNavigation() 
    const queryClient = useQueryClient()
    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const {data,isLoading,error}:useGetUserType  = useQuery({
        queryKey:["user"], 
        queryFn:async()=>{
            const response = await axios.get(SERVER_URL+`/user`,config)
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
            if(data?.user)
                set_user({tokens:user!?.tokens,...data.user})
        }
    }) 
    const refresh = ()=>queryClient.invalidateQueries({queryKey:["user"]}) 
    // const refresh = ()=>mutate(); 
    const [refreshing,onRefresh] = useRefresh(refresh)    

    return {
        isLoading,
        error, 
        refreshing, onRefresh
    }
}

export {
    useGetUser
}

