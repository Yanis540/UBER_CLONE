import { UseMutateAsyncFunction, UseMutateFunction, useMutation } from "@tanstack/react-query"
import axios, { AxiosRequestConfig } from "axios"
import { useToast } from "react-native-toast-notifications"
import { SERVER_URL } from "../../../../../../env";
import { handleErrorMessage } from "../../../../../../util/error";
import { useAuth } from "../../../../../../context/store";

type DataResponse =CloudPhotoDetails

interface  useUpdatePaymentMethodType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, void, unknown>
    mutateAsync:UseMutateAsyncFunction<DataResponse, unknown, void, unknown>
}


const useUpdatePaymentMethod = ()=>{
    const toast = useToast(); 
    const {user,set_user} = useAuth(); 
    const config:AxiosRequestConfig<{}>={
        headers:{
            Authorization:`Bearer ${user!?.tokens!?.access?.token}`
        }
    }
    const {data,isLoading,error,mutate:update,mutateAsync:updateAsync}:useUpdatePaymentMethodType  = useMutation({
        mutationKey:["user","payment-method"], 
        mutationFn:async()=>{
            const response = await axios.put(`${SERVER_URL}/user/payment-method`,{},config)
            const data = await response.data;
            return data ; 
        },
        onSuccess:(data)=>{
            if(data?.user)
                set_user({tokens:user?.tokens,...data.user})
        }, 
        onError:(err:any)=>{
            const errMessage = handleErrorMessage(err); 
            toast.show(errMessage,{type:"danger"})
        }
    }); 

    return {
        data:data,
        update  ,
        updateAsync, 
        isLoading,
        error
    }
}

export {
    useUpdatePaymentMethod
}