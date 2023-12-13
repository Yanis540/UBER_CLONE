

import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { SERVER_URL } from "../../env"
import { useAuth, } from "../../context/store"
import {z} from "zod"
import { useToast } from "react-native-toast-notifications"
import { PageCommentDataResponse } from "./use-infinite-comments"


type PropsType = {
    type: "like"|"unlike"
} 

type DataResponse ={
    message : string 
    comment : Comment  
    error ?:{message:string}
}

interface  useLikeCommentType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, PropsType, unknown>
}


const useLikeComment = (id:string)=>{
    const {user,} = useAuth();
    const toast = useToast(); 
    const queryClient = useQueryClient(); 
    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const {data,isLoading,error,mutate:like}:useLikeCommentType  = useMutation({
        mutationKey:["comments","like",id], 
        mutationFn:async({type}:PropsType)=>{
            const response = 
                type=="like" 
                ?   await axios.put(SERVER_URL+`/comments/like/${id}`,{},config)
                :   await axios.delete(SERVER_URL+`/comments/like/${id}`,config)
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
            queryClient.setQueryData(["comments","driver",(data.comment as Comment).licence_id],(prev:any)=>{
                if(!prev?.pages)
                    return prev ; 
                const updated_comment = (data.comment) as Comment 
                const updated_store ={
                    ...prev , 
                    pages: prev.pages.map((page:PageCommentDataResponse)=>({
                        ...page , 
                        comments: page.comments.map((comment)=>comment?.id != (updated_comment.id)?comment : updated_comment)
                    }))
                }
                return updated_store
            })
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
        like  ,
        isLoading,
        error
    }
}

export {
    useLikeComment
}

//! to be used when not using pagination 
// queryClient.setQueryData(["comments","driver",(data.comment as Comment).licence_id],(prev:any)=>{
//     if(!prev.comments)
//         return prev ; 
//     const old_comments = prev.comments as Comment []
//     const index_comment = findIndex(old_comments,{id:id})
//     if(index_comment == -1)
//         return prev ; 
//     return {
//         ...prev , 
//         comments: (old_comments).map((comment,index)=>index!=index_comment?comment:data.comment)
//     }
// })