import axios, { AxiosError, AxiosRequestConfig } from "axios"

import {
    InfiniteQueryObserverResult,
    useQueryClient,
    useInfiniteQuery,
    InfiniteData,
    FetchNextPageOptions,
  } from '@tanstack/react-query'
import { useToast } from "react-native-toast-notifications"
import { SERVER_URL } from "../../env"
import { useAuth  } from "../../context/store"
import { useRefresh } from "../use-refresh"
import { useEffect } from "react"
export type PageCommentDataResponse = {
    comments: Comment[], 
    next: boolean, 
    page_size: number, 
    number_page_comments : number 
    error?:{message:string}
} 
interface useInfiniteCommentsType  {
    data ?:InfiniteData<PageCommentDataResponse>,
    error : unknown
    isLoading : boolean 
    isFetchingNextPage : boolean 
    hasNextPage ?: boolean
    fetchNextPage:(options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<any, any>>

}   
const useInfiniteComments= (driverId:string)=>{
    const {user} = useAuth(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const toast = useToast(); 
    const queryClient = useQueryClient()
    useEffect(()=>{
        queryClient.removeQueries({queryKey:["comments","driver",driverId]})
    },[])

    const{data,error,isLoading, isFetchingNextPage,fetchNextPage,hasNextPage}:useInfiniteCommentsType =useInfiniteQuery({
        queryKey : ["comments","driver",driverId],
        queryFn : async({pageParam=0})=>{
            // console.log(`comments/driver/${driverId}/?index=${pageParam}`)
            const response = await axios.get(`${SERVER_URL}/comments/driver/${driverId}/?index=${pageParam}`,config)
            const data = await response.data
            return data;
        } , 
        getNextPageParam:(last_page,pages)=>{
            if (last_page?.next) {
                return pages.map((page)=>(page as PageCommentDataResponse).number_page_comments).reduce((acc,current)=>acc+current,0);
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
    })
    // const refresh = ()=>queryClient.invalidateQueries({queryKey:["comments","driver",driverId]})
    const [refreshing,onRefresh] = useRefresh(()=>{})
    const {comments,number_comments} = 
        !data?.pages
        ?   ({comments:[],number_comments:0})
        :   data.pages.reduce((acc, page) => ({
                comments:acc.comments.concat(page.comments),
                number_comments:(acc.number_comments+page.number_page_comments)
            }), 
            ({
                comments:([] as Comment[]),
                number_comments:0
            }))
    return {
        data:{
            comments:comments,
            number_comments: number_comments,
            error:(((error as AxiosError<unknown, any>)?.response )?.data as PageCommentDataResponse)?.error?? undefined 
        }, 
        error,
        isLoading,
        refreshing,onRefresh, 
        more:{
            hasNext : hasNextPage, 
            isLoading:isFetchingNextPage,
            load:()=>fetchNextPage()
        }
    }
}
 
export {
    useInfiniteComments
}