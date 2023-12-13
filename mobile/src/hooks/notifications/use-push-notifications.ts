
import axios, { AxiosError,AxiosHeaders, AxiosRequestConfig } from 'axios';
import { SERVER_URL,CLIENT_URL } from '../../env';
import { useAuth } from '../../context/store';
import { ExpoPushNotification, PushNotification } from './notifications';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRefresh } from '../use-refresh';
import * as Notifications from 'expo-notifications';
import {Platform} from "react-native"
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { navigationRef, useNavigation } from '../../routes';
type DataResponse = {
    user: User  
    error?:{message:string}
} 
interface usePushNotificationTokenType  {
    data ?:DataResponse|null
    error : unknown
    isLoading : boolean 
    // mutate : UseMutateFunction<any, unknown, any ,unknown>
    // mutateAsync : UseMutateAsyncFunction<any, unknown, any, unknown>

}   

const usePushNotificationToken = async()=>{
    const {user,set_user} = useAuth(); 
    const config : AxiosRequestConfig={
        headers:{
            Authorization:`Bearer ${user?.tokens?.access?.token??""}`
        }
    }
    const queryClient = useQueryClient()
    const {data,error,isLoading}:usePushNotificationTokenType= useQuery({
        queryKey:["user","push-notifications","token"], 
        queryFn:async()=>{
            const pushNotification = new PushNotification(new ExpoPushNotification())
            const token = await pushNotification.registerForPushNotificationsAsync()
            if(!token)
                return null ;
            if(user?.push_token_value == token)
                return user ;  
            
            const response = await axios.put(`${SERVER_URL}/user/push-notifications/token`,{push_notifications_token:token},config)
            const data = await response.data
            return data;
        }, 
        onSuccess:(data)=>{
            if(!data?.user)
                return 
            set_user({tokens:user?.tokens,...data.user})
        }, 
        onError:(err:any)=>{
        }
       
    })
    const refresh = ()=>queryClient.invalidateQueries({queryKey:["user","push-notifications","token"]})
    const [refreshing,onRefresh] = useRefresh(refresh)
    return {
        data:{
            user: data?.user?data.user:undefined,
            error:(((error as AxiosError<unknown, any>)?.response )?.data as DataResponse)?.error?? undefined 
        }, 
        error,
        isLoading,
        refreshing,onRefresh
    }
    
}



const useListenNotifications = ()=>{
    const {user}= useAuth(); 
    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    useEffect(()=>{
        if(!user)
            return ; 
        if(!lastNotificationResponse)
            return ; 
        const {request} = lastNotificationResponse.notification; 
        const {data:unstructuredData  ,body,title,subtitle}= request.content; 
            const data = (unstructuredData as NotificationData)
            if(!data?.event || !data?.body ){
                return ; 
            }
            switch(data.event){
                case "ride":{
                    if(data.body?.id)
                        navigateToRideScreen(user,data.body.id)
                }
                    
            }
    },[lastNotificationResponse])


}


export {usePushNotificationToken, useListenNotifications}



const navigateToRideScreen = (user:User,id:string)=>{
    if(!user)
        return 
    if(user.role!="DRIVER"){
        return navigationRef?.current?.navigate("User",{
            screen:"home_stack",
            params:{
                screen:"ride",
                params:{id}
            }
        })
    }
    // if driver go to driver 
}
