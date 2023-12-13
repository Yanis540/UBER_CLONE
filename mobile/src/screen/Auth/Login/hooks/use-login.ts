import { useMutation , UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { LoginSchema } from "../types"
import { useAuth } from "../../../../context/store"
import { SERVER_URL } from "../../../../env"
import { useToast } from "react-native-toast-notifications"




interface DataResponse {
    error?: {message: string}, 
    user? : User, 
    tokens ? :AuthCredentials
}

interface useLoginMutation  {
    data ?: DataResponse
    isLoading : boolean 
    error : unknown 
    mutateAsync : UseMutateAsyncFunction<any, unknown,LoginSchema, unknown>
}




const useLogin = ()=>{
    const toast = useToast()
    const {set_user} = useAuth();
    const {data,isLoading,error,mutateAsync:login}:useLoginMutation = useMutation({
        mutationKey:["login"],
        mutationFn:async({email,password}:LoginSchema)=>{
            const response= await axios.post(SERVER_URL+"/auth/login",{email,password}); 
            const data = await response.data ; 
            return data ; 
        }, 
        onSuccess:(data:DataResponse)=>{
            const {user,tokens} = data ; 
            if(!user || !tokens) 
                return ; 
            set_user({...user,tokens})
            
        }, 
        onError: (err:any)=>{
            if(err instanceof AxiosError && err?.response?.data?.error?.message)
                toast.show(`${err.response.data.error.message}`,{type:"danger",placement:"bottom"})
            else 
                toast.show(`Unknown error occured`,{placement:"bottom"})

        }
    }); 

    return {
        data: {
            error: (((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined , 
            user: data?.user ?? undefined , 
            tokens: data?.tokens ?? undefined , 
        } , isLoading , 
        error , login
    }
}


export {
    useLogin 
}


