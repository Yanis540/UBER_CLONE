import { RideStatus } from "@prisma/client"
import { io } from "../../../../../../server"
import { db } from "../../../../../libs/db"
import { push } from "../../../../../libs/expo"
import { getUsersPushTokens } from "../../../../../libs/notifications/util"
type NotifyRideStatusProps = {
    user_ids : string | string[]
    status: RideStatus 
    ride : RideWithFull
}
export const notify_ride_status = async ({user_ids,status,ride}:NotifyRideStatusProps)=>{
    const push_tokens = await getUsersPushTokens({user_ids}); 
    await push.sendPushNotifications([
        {
            to:push_tokens,
            options:{
                title:`Ride ${status}`, 
                body: "Ride update", 
                data:{
                    event:"ride",
                    body:{
                        id:ride.id
                    }
                }
            }
        }
    ])
    io!.to(user_ids).emit<EmitSocketEvents>(`user:ride`,{ride});
}