

import { UseMutateAsyncFunction, UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { useToast } from "react-native-toast-notifications"
import { useAuth } from "../../../../context/store";
import { SERVER_URL } from "../../../../env";
import { useUploadImages } from "../../../../hooks";
import { default_user_img } from "../../../../styles";


type PropsType = {
    address ?:string
    name ?: string 
    photo ? : string | {
        cloud:Partial<CloudPhotoDetails>
    }
    old_password ? : string 
    new_password ? : string 
    confirm_password ? : string 
} 

type DataResponse ={
    message : string 
    comment : Comment  
    error ?:{message:string}
}

interface  useUpdateUserType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<DataResponse|undefined, unknown, PropsType, unknown>
    mutateAsync:UseMutateAsyncFunction<DataResponse|undefined, unknown, PropsType, unknown>
}


const useUpdateUser = ()=>{
    const {user,set_user} = useAuth();
    const toast = useToast(); 
    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const {data,isLoading,error,mutate:update,mutateAsync:updateAsync}:useUpdateUserType  = useMutation({
        mutationKey:["user",user?.id], 
        mutationFn:async(props:PropsType)=>{
            const response = await axios.put(SERVER_URL+`/user`,props,config)
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
            toast.show("Profile Updated",{type:"success"})
           if(data.user){
                set_user({tokens:user!?.tokens, ...data.user})
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
            comment: data?.comment ?? undefined, 
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        },
        update  ,
        updateAsync, 
        isLoading,
        error
    }
}


const useUpadteProfilePicture = ()=>{
    const {uploadAsync,isLoading: isUploading} = useUploadImages(); 
    const {update,isLoading: isUpdating} = useUpdateUser()
    const update_photo = async()=>{
        try{
            const data = await uploadAsync(); 
            if(!data?.url)
                return ; 
            update({
                photo:{
                    cloud:{
                        asset_id:data.asset_id, 
                        public_id:data.public_id, 
                        access_mode:data.access_mode, 
                        folder:data.folder, 
                        resource_type:data.resource_type, 
                        secure_url:data.secure_url, 
                        signature:data.signature, 
                        url:data.url, 
                    }
                }
            })
        }
        catch(err:any){

        }
    }
    const remove_photo = ()=>{
        update({photo : default_user_img})
    }
    return {
        remove : remove_photo , 
        update:update_photo, 
        isLoading : isUploading|| isUpdating
    }
}

export {
    useUpdateUser, 
    useUpadteProfilePicture
}
