

import { UseMutateAsyncFunction, UseMutateFunction, useMutation } from "@tanstack/react-query"
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios"
import { useToast } from "react-native-toast-notifications"
import { useAuth, useLocalisationStore } from "../../../../../../../context/store";
import { CLIENT_URL, SERVER_URL } from "../../../../../../../env";
import { useNavigation } from "../../../../../../../routes";
import { useAddRideStore } from "../../../context/use-add-ride-store";

type PropsType = {
    total: number 
} 

type DataResponse ={
    message : string 
    ride : Ride  
    error ?:{message:string}
}

interface  useAddRideType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, PropsType, unknown>
    mutateAsync:UseMutateAsyncFunction<any, unknown, PropsType, unknown>
}


const useAddRide = ()=>{
    const {user,} = useAuth();
    const toast = useToast(); 
    const {clear_store,starting_at,...addstore} = useAddRideStore(); 
    const {localisation} = useLocalisationStore(); 
    const {navigation} = useNavigation();
    const redirect = (ride_id : string)=>{
        clear_store();
        navigation.navigate("User",{
            screen:"home_stack",
            params:{
                screen:"ride", 
                params:{
                    id : ride_id
                }
            }
        })
    }
    const get_body = (total:number)=>{
        const {car_type,origin,destination,informations,payment_type} = addstore; 
        const start_address_place_id= origin!?.address.place_id; 
        const destination_address_place_id= destination!?.address.place_id; 
        const {distance,time:time_in_min_num}= informations!; 
        const total_time = `${Math.round(time_in_min_num).toString()} min`;
        const axiosHeaders = new AxiosHeaders();
        const axiosConfig = {
            url: CLIENT_URL,
            headers:axiosHeaders    
        };
        if(!localisation)
            throw new AxiosError("Localisation","LOC404",undefined,undefined,{
                status:401, 
                data:{error:{message:"Can not access location"}}, 
                statusText:"NOT OK", 
                config:axiosConfig,
                headers:axiosHeaders,    
            })
        const user_gps_localisation:Point = localisation;
        return {
            car_type, payment_type,
            starting_at , 
            start_address_place_id, destination_address_place_id, 
            distance:Math.round(distance) , 
            total, total_time, 
            user_gps_localisation
        }
    }

    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }

    const {data,isLoading,error,mutate:add,mutateAsync:addAsync}:useAddRideType  = useMutation({
        mutationKey:["rides","new"], 
        mutationFn:async({total}:PropsType)=>{
            const body = get_body(total);
            const response = await axios.post(SERVER_URL+`/rides/new`,body,config); 
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
            toast.show(data.message,{type:"success",placement:"bottom"}); 
            if((data.ride as Ride).payment_type=="cash"){
                redirect((data.ride as Ride).id)
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
            ride: data?.ride ?? undefined, 
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        },
        add  ,
        addAsync, 
        redirect , 
        isLoading,
        error
    }
}

export {
    useAddRide
}
