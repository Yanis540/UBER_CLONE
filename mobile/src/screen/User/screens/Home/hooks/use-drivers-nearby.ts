import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios"

import {
    useQueryClient,
    useQuery,
} from '@tanstack/react-query'
import { useToast } from "react-native-toast-notifications"
import { useAuth, useLocalisationStore, useSocketStore } from "../../../../../context/store"
import { CLIENT_URL, SERVER_URL } from "../../../../../env"
import { useRefresh } from "../../../../../hooks"
import { handleErrorMessage } from "../../../../../util/error"

type DataResponse = {
    drivers : Driver []
    error?:{message:string}
} 
interface useDriversNearbyType  {
    data ?:DataResponse
    error : unknown
    isLoading : boolean

}   
const useDriversNearby= ()=>{
    const {user} = useAuth(); 
    const {localisation} = useLocalisationStore();
    const {socket} = useSocketStore(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const queryClient = useQueryClient()
    const axiosHeaders = new AxiosHeaders();
    const axiosConfig = {
        url: CLIENT_URL,
        headers:axiosHeaders    
    };
    const {data,error,isLoading}:useDriversNearbyType= useQuery({
        queryKey:["drivers","nearby"],
        queryFn:async()=>{
            if(!localisation)
                throw new AxiosError("Localisation","LOC404",undefined,undefined,{
                    status:401, 
                    data:{error:{message:"Can not access location"}}, 
                    statusText:"NOT OK", 
                    config:axiosConfig,
                    headers:axiosHeaders,    
                }); 
            const response = await axios.put(`${SERVER_URL}/drivers/nearby`,{
                localisation:localisation
            },config)
            const data = await response.data
            return data
        },

        enabled: !! localisation,  
        onSuccess:(data:any)=>{
            if(!data?.drivers)
                return ; 
            const drivers= data.drivers as Driver[]
            const drivers_ids = drivers.map((driver)=>driver.licence_id);
            socket?.emit<EmitSocketEvents>("user:track-drivers",{drivers_ids})
        }, 
        onError:(err:any)=>{
            const errorMessage = handleErrorMessage(err); 
            toast.show(errorMessage,{type:"danger"})
        }
    });
    const refresh = ()=>queryClient.invalidateQueries({queryKey:["drivers","nearby"],});
    const [refreshing,onRefresh] = useRefresh(refresh);
    
    
    return {
        data:{
            drivers: data?.drivers?data.drivers:[],
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        }, 
        error,
        isLoading,
        refreshing,onRefresh
    }
}
 
export {
    useDriversNearby
}