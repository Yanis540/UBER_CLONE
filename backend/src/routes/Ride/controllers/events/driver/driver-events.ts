import { io } from "../../../../../../server";
import { db } from "../../../../../libs/db";
import { push } from "../../../../../libs/expo";
import { getUsersPushTokens } from "../../../../../libs/notifications/util";
import { drivers_nearby, isNearby } from "../../../../../util";
type NotifyDriversOfProposedRideProps = {
    ride: RideWithFull ,
    radius?:number
}

const notify_drivers_of_proposed_ride = async({ride,radius}:NotifyDriversOfProposedRideProps)=>{
    const available_drivers = drivers_nearby({localisation:ride!.start_address.localisation,radius,drivers:io?.drivers??[]})
    if(!available_drivers?.length)
        return [];  
    const push_tokens = await getUsersPushTokens({user_ids:available_drivers}); 
    await push.sendPushNotifications([
        {
            to:push_tokens,
            options:{
                title:`New Ride`, 
                body: "approximate to you", 
                data:{
                    event:"ride",
                    body:{
                        id:ride.id
                    }
                }
            }
        }
    ])
    io?.to(available_drivers).emit<EmitSocketEvents>("driver:ride-proposed",{ride})
    return available_drivers; // to be used for push notifications 
}

export {notify_drivers_of_proposed_ride}