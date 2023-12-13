
import {useEffect} from "react"
import { UseMutateAsyncFunction, UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { SERVER_URL } from "../../env"
import { useAuth, useRideStore } from "../../context/store"
import { useStripePayment } from "../stripe/use-stripe-payment"
import { useToast } from "react-native-toast-notifications"


interface  useValidateRidePaymentIntentType {
    error: unknown 
    data : {
        message: string , 
        ride : Ride 
        error ?:{message:string}
    }|undefined
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, void, unknown>
    mutateAsync:UseMutateAsyncFunction<any, unknown, void, unknown>
}


/**
*  @Yanis540 
*  @description Validates the ride payment intent that is created using Credit card 
*
*   - It starts by poping up Stripe payment 
*/
const useValidateRidePaymentIntent = (ride:Ride)=>{
    const {user} = useAuth(); 
    
    const toast = useToast(); 
    const {set_ride,paying} = useRideStore();
    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const {data,isLoading,error,mutate,mutateAsync}:useValidateRidePaymentIntentType  = useMutation({
        mutationKey:["rides","ride","payment","validate","payment-intent",ride?.id??""], 
        mutationFn:async()=>{
            const response = await axios.put(`${SERVER_URL}/rides/ride/payment/validate/payment-intent/${ride?.id??""}`,{},config)
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
          toast.show(data.message,{placement:"bottom",type:"success",successColor:"green"})  
          if(data.ride)
            set_ride(data.ride)
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
    const {pay,isPaying} = useStripePayment({
        ...ride?.payment_intent!?.stripe_payment_intent!,
        confirm:mutateAsync
    });
    useEffect(()=>{
        paying(isPaying)
    },[isPaying])
  
    
    return {pay,isPaying,data,error}; 
}

export {
    useValidateRidePaymentIntent
}

