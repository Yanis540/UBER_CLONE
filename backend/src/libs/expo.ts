import { Expo } from 'expo-server-sdk';
import {sendPushNotifications} from "./notifications/push-notifications"
// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
const push =  {
    sendPushNotifications
}
export {expo,push}