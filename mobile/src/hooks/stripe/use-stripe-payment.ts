import {useEffect, useState} from "react"
import { UseMutateAsyncFunction, useMutation } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { useStripe } from "@stripe/stripe-react-native"
import { useToast } from "react-native-toast-notifications"
import { useAuth } from "../../context/store"


type useStripePaymentProps= {
    client_secret:string,
    ephemeralKey_secret:string,
    customer_id:string
    confirm : (data?:any)=>Promise<void|any>
    data ? : any
}


 
const useStripePayment= ({client_secret,ephemeralKey_secret,customer_id,confirm,data}:useStripePaymentProps)=>{
    const {user}= useAuth(); 
    const toast = useToast()
    const [isPaying,setIsPaying] = useState<boolean>(false); 
    const { presentPaymentSheet,initPaymentSheet } = useStripe();
    const initializePaymentSheet = async () => {
        if(!client_secret||!ephemeralKey_secret || !customer_id){
            throw new Error("Payment invalid, please try later")
        }
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Yanis Shop Inc.",
            customerId:customer_id,
            customerEphemeralKeySecret: ephemeralKey_secret,
            paymentIntentClientSecret:client_secret,
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: user!?.name??"unknown",
            }
        });
        if(error){
            throw new Error(error.message); 
        }
        return true;
    }
    
    const openPaymentSheet = async () => {
        try{
            setIsPaying(true)
            await initializePaymentSheet();
            
            const { error } = await presentPaymentSheet();
            if(error && (error.localizedMessage||error.message).includes("succeded")){
                throw new Error("Error trying to open payment")
                // throw new Error(error.localizedMessage)
            }
            await confirm(data)
        }
        catch(err:any|AxiosError){
            if(!(err instanceof AxiosError)|| (!err.response?.data?.error)){
                toast.show(`${err.message}`,{type:"danger",placement:"bottom"} );
            }
            else {
                toast.show(`${err.response.data.error.message}`,{type:"danger",placement:"bottom"})
            }
        }
        finally{
            setIsPaying(false); 
        }
    };

    return {
        pay: openPaymentSheet , 
        isPaying
    }
    
    
}


export {
    useStripePayment
}

