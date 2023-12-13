import { useRefundRide } from "../use-refund-ride"
import { useAcceptRide } from "./use-accept-ride"
import { useCancelRide } from "./use-cancel-ride"
import { useEndRide } from "./use-end-ride"
import { useStartRide } from "./use-start-ride"


export const useRideStatus = (id?:string)=>{
    return {
        cancel: useCancelRide(),
        accept : useAcceptRide(),
        start : useStartRide(), 
        end : useEndRide(), 
        refund : useRefundRide(id!)
    }
}