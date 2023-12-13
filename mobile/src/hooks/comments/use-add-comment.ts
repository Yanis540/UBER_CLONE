

import { UseMutateAsyncFunction, UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { SERVER_URL } from "../../env"
import { useAuth, } from "../../context/store"
import { useToast } from "react-native-toast-notifications"
import { PageCommentDataResponse } from "./use-infinite-comments"

const page_size = 10 ; 

type PropsType = {
    text:string
} 

type DataResponse ={
    message : string 
    comment : Comment  
    error ?:{message:string}
}

interface  useAddCommentType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, PropsType, unknown>
    mutateAsync:UseMutateAsyncFunction<any, unknown, PropsType, unknown>
}


const useAddComment = (driverId:string)=>{
    const {user,} = useAuth();
    const toast = useToast(); 
    const queryClient = useQueryClient(); 
    const config:AxiosRequestConfig<any> = {
        headers:{
            authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const {data,isLoading,error,mutate:comment,mutateAsync:commentAsync}:useAddCommentType  = useMutation({
        mutationKey:["comments","new","driver",driverId], 
        mutationFn:async({text}:PropsType)=>{
            const response = await axios.post(SERVER_URL+`/comments/new/driver/${driverId}`,{text},config)
            const data = await response.data
            return data;
        },
        onSuccess:(data)=>{
            queryClient.setQueryData(["comments","driver",(data.comment as Comment).licence_id],(prev:any)=>{
                if(!prev?.pages)
                    return prev ;
                const pages = (prev.pages as PageCommentDataResponse[])
                const added_comment = (data.comment as Comment);
                if(pages.length==0) 
                    return {
                        ...prev,
                        pages:[
                            {comments :[added_comment],next:true,page_size:page_size,number_page_comments:1,error:undefined}
                        ]
                    } 
                const isFirstPageFull = pages[0].number_page_comments == pages[0].page_size ; // the max page_size ; 
                if(!isFirstPageFull)
                    return {
                        ...prev,
                        pages:pages.map((page,index)=>index!=0?page : ({
                            ...page, 
                            comments : [added_comment,...page.comments], 
                            number_page_comments : page.number_page_comments +1 
                        }))
                    }
                return {
                    ...prev, 
                    pages : [{comments :[added_comment],next:true,page_size:page_size,number_page_comments:1,error:undefined}, ...pages]
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
        comment  ,
        commentAsync, 
        isLoading,
        error
    }
}

export {
    useAddComment
}
// queryClient.setQueryData(["comments","driver",(data.comment as Comment).licence_id],(prev:any)=>{
//     if(!prev?.comments)
//         return prev ; 
//     return {
//         ...prev , 
//         comments:prev.comments?.length == 0 ? [data.comment]:[data.comment,...prev.comments]
//     }
// })