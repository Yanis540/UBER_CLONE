import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    useMutation,
    UseMutateFunction, UseMutateAsyncFunction, 
    useQueryClient,
    useQuery,
  } from '@tanstack/react-query'
import { useToast } from "react-native-toast-notifications"
import { SERVER_URL } from "../../../../../env"
import { useAuth, useLocalisationStore } from "../../../../../context/store"
import { useRefresh } from "../../../../../hooks"
import { getVicinityFromGeolocation } from "../../../../../util/maps"
import { handleErrorMessage } from "../../../../../util/error"
import { useEffect } from "react"
type Props = {
    radius ? : number
}
type DataResponse = {
    rides: Ride[], 
    error?:{message:string}

} 

interface useNearbyRidesType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean 
    mutate : UseMutateFunction<Props|undefined, unknown, any ,unknown>
    mutateAsync : UseMutateAsyncFunction<Props|undefined, unknown, any, unknown>
}   
const useNearbyRides= ()=>{
    const {localisation} = useLocalisationStore()
    const {user} = useAuth(); 
    const queryClient = useQueryClient(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const {data,error,isLoading,mutate,mutateAsync}:useNearbyRidesType= useMutation({
        mutationKey:["rides","nearby"], 
        mutationFn:async(props?:Props)=>{
            const {radius} = props||{};
            if(!localisation)
                return {}; 
            // radius
            // index
            const vicinities = await getVicinityFromGeolocation(localisation); 
            const response = await axios.put(SERVER_URL+'/rides/nearby',{localisation,vicinities:vicinities,radius},config)
            const data = await response.data
            return data;
        }, 
        onError:(err:any)=>{
            const errorMessage = handleErrorMessage(err); 
            toast.show(errorMessage,{type:"danger"})
        }
       
    })
    const refresh = ()=>mutate({})
    const [refreshing,onRefresh] = useRefresh(refresh) 
    useEffect(()=>{
        mutate({})
    },[])
    return {
        data:{
            rides: data?.rides?data.rides:[],
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 

        }, 
        error,
        isLoading,
        refreshing,onRefresh, 
        refresh:mutate
    }
}



export {useNearbyRides}