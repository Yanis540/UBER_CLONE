import { Expo, ExpoPushTicket, ExpoPushMessage } from 'expo-server-sdk';
import { expo } from '../expo';


type PushEvent = "ride" |"comment"
type PushData = {
    event : PushEvent
    body ?: {
        [key: string]: any
    }
};

type PushNotificationMessage = {
    to:string|string[],
    options:{
        data : PushData
    }&{
        [key: string]: any
    };
}
type ExpoPushNotificationsMessage = {
    
    options: {
        data : PushData&{ 
            [key: string]: any
        }
        body : string 
    }& Omit<ExpoPushMessage,"to"|"data"|'body'>
}&Omit<PushNotificationMessage,"options">




    // https://github.com/expo/expo-server-sdk-node
export const sendPushNotifications = async(messages:ExpoPushNotificationsMessage[])=> {
    const notifications:ExpoPushMessage[]= messages
        .filter((message)=>
            typeof message.to=="string"
            ?   Expo.isExpoPushToken(message.to)
            :   message.to.filter((token)=>Expo.isExpoPushToken(token))
        )
        .map((message)=>({
            ...message.options,
            to:message.to,
            data:message.options.data,
            body:message.options.body,
        }))
    ; 
    const chunks = expo.chunkPushNotifications(notifications);
    const tickets:any[] = [];
    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } 
            catch (error) {
                console.error(error);
            }
        }
    })();
    let receiptIds = [];
    for (let ticket of tickets) {
        if (ticket.id) {
            receiptIds.push(ticket.id);
        }
    }
    
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
        try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receiptId in receipts) {
                let { status, message, details } = receipts[receiptId] as any ;
                if (status === 'ok') 
                    continue;
                else 
                if (status === 'error') {
                    console.error(`There was an error sending a notification: ${message}`);
                    if (details && details.error) 
                        console.error(`The error code is ${details.error}`);
                }
            }
        } 
        catch (error) {
            console.error(error);
        }
    }
    })();

    
}
