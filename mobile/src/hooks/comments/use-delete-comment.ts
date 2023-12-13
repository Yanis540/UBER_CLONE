import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { SERVER_URL } from "../../env"
import { useAuth, } from "../../context/store"
import { useToast } from "react-native-toast-notifications"
import { PageCommentDataResponse } from "./use-infinite-comments"




type DataResponse ={
    message : string 
    comment : Comment  
    error ?:{message:string}
}

interface  useDeleteCommentType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, void, unknown>
}


const useDeleteComment = (id:string)=>{
    const {user,} = useAuth();
    const toast = useToast(); 
    const queryClient = useQueryClient(); 
    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const {data,isLoading,error,mutate:delete_comment}:useDeleteCommentType  = useMutation({
        mutationKey:["comments","delete",id], 
        mutationFn:async()=>{
            const response = await axios.delete(SERVER_URL+`/comments/delete/${id}`,config)
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
            toast.show(data.message,{type:"success"})
            queryClient.setQueryData(["comments","driver",(data.comment as Comment).licence_id],(prev:any)=>{
                if(!prev?.pages)
                    return prev ; 
                const deleted_comment = data.comment as Comment 
                const pages = prev.pages as PageCommentDataResponse[]; 
                const updated_pages = pages.map((page,index_page)=>{
                    const comments = page.comments.filter((comment)=>comment.id != deleted_comment.id); 
                    return {
                        ...page , 
                        number_page_comments: page.number_page_comments!=0? page.number_page_comments-1:  0, 
                        comments: comments  
                    }
                })
                
                return {
                    ...prev , 
                    pages:updated_pages
                }
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
        delete_comment  ,
        isLoading,
        error
    }
}

export {
    useDeleteComment
}

// queryClient.setQueryData(["comments","driver",(data.comment as Comment).licence_id],(prev:any)=>{
//     if(!prev?.comments)
//         return prev ; 
    
//     return {
//         ...prev , 
//         comments:(prev.comments as Comment[]).filter((comment)=>comment.id!= ((data.comment as Comment).id))
//     }
// })