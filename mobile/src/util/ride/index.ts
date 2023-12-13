
export const rideInformations = (ride?:Ride)=>{
    const isRideCancellable = ride==undefined?false:  ride.ride_status!="cancelled" && ride.ride_status !="finished" 
    const canChangePaymentMethod = ride==undefined
    ?   false
    :   ride.ride_status!="cancelled" && ride.ride_status !="finished" && (
        (ride.payment_type=="cash")|| (
            ride.payment_status!="succeeded" && ride.payment_intent // a payment intent exists 
        )
    )
    const isRideRefundable = ride &&  ride.ride_status == "cancelled" && ride.payment_status=="succeeded"   
    return {
        cancellable:isRideCancellable ,  
        payment_method_changeable : canChangePaymentMethod, 
        refundable : isRideRefundable
    }
}