import { AxiosError, AxiosHeaders } from "axios";
import { CLIENT_URL } from "../../env";
import * as Notifications from 'expo-notifications';
import {Platform} from "react-native"
import * as Device from 'expo-device';

interface PushNotificationInterface {
    registerForPushNotificationsAsync():Promise<string |null | undefined> 
}

export class PushNotification {
    private push : PushNotificationInterface ; 
    constructor (push: PushNotificationInterface){
        this.push = push ; 
    }
    async registerForPushNotificationsAsync(){
        return await this.push.registerForPushNotificationsAsync()
    }
}


export class ExpoPushNotification  implements PushNotificationInterface{
    constructor(){

    }
    async registerForPushNotificationsAsync(){
        const axiosHeaders = new AxiosHeaders();
        const axiosConfig = {url: CLIENT_URL,headers:axiosHeaders};
        if(!Device.isDevice){
            throw new AxiosError('Push Notifications',"ERROR",undefined,undefined,{ status:401, 
                data:{error:{message:"Must use physical device for Push Notifications"}}, 
                statusText:"NOT OK", 
                config:axiosConfig,
                headers:axiosHeaders,   
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            if(status!=="granted")
                return null ; 
        }
        
        const {data:token} = await Notifications.getExpoPushTokenAsync({
            // projectId: Constants?.expoConfig?.extra?.eas.projectId,
        });
        // console.log(token);
    
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    
        return token;
    }
}