import React, { ReactNode } from 'react';
import { uberFont } from '../../../styles';
import { Text, View , TouchableOpacity, ActivityIndicator } from 'react-native'
import { rideInformations } from '../../../util/ride';
import { useAuth, useRideStore } from '../../../context/store';
import { useChangeRidePaymentMethod, useValidateRidePaymentIntent } from '../../../hooks/rides';
import { FontAwesome5 } from '@expo/vector-icons';
import MapRoute from '../../Map/MapRoute';
import { useNavigation } from '../../../routes';
interface RidestatusProps {
    ride ?: Ride
    children?:ReactNode
};

export function Ridestatus({children,ride}:RidestatusProps) {
    if(!ride)
        return null ;
    return (
    <View className="items-baseline">
        <View  className={`
            flex flex-col items-center py-1 px-3  rounded-lg 
            ${
                ride.ride_status=="finished"
                ?   "bg-green-200"
                :   ride.ride_status == "accepted"
                    ?   "bg-yellow-200"
                    :   ride.ride_status=="cancelled"
                        ?   "bg-red-200"
                        :   "bg-white border-[1px] border-black" 
            }
        `}>
            {children==undefined &&(
                <Text style={uberFont} className={`
                    ${
                        ride.ride_status=="finished" 
                        ?   "text-green-500"
                        :   ride.ride_status == "accepted"
                            ?   "text-yellow-500"
                            :   ride.ride_status=="cancelled"
                                ?   "text-red-500"
                                :   "text-black" 
                    }
                `}>
                    {ride.ride_status}
                </Text>
            )}
            {children}
            
        </View>
    </View>
    );
};

interface RidepaymentstatusProps {
    ride:Ride
};

export function Ridepaymentstatus({ride}:RidepaymentstatusProps) {
    return (
    <View className="items-baseline">
        <View  className={`
            py-1 px-3  rounded-lg 
            ${
                ride.payment_status=="succeeded"
                ?   "bg-green-200"
                :   ride.payment_status == "refunded"
                    ?   "bg-yellow-200"
                    :   ride.payment_status=="cancelled"
                        ?   "bg-red-200"
                        :   "bg-white border-[1px] border-black" 
            }
        `}>
            
            <Text style={uberFont} className={`
                ${
                    ride.payment_status=="succeeded" 
                    ?   "text-green-500"
                    :   ride.payment_status == "refunded"
                        ?   "text-yellow-500"
                        :   ride.payment_status=="cancelled"
                            ?   "text-red-500"
                            :   "text-black" 
                }
            `}>
                {ride.payment_status}
            </Text>
        </View>
    </View>
    );
};



interface RideChangePaymentMethodButtonProps {
};

export function RideChangePaymentMethodButton({}:RideChangePaymentMethodButtonProps) {
    const {ride,isCancelling} = useRideStore();
    const {user} = useAuth()
    const {change,isLoading,error} = useChangeRidePaymentMethod(ride?.id??"")
    const {payment_method_changeable} = rideInformations(ride)
    const changePaymentMethod = ()=>{
        if(user?.role!="DRIVER" && !isCancelling)
            change({})
    } 
    if(ride== undefined) 
        return null ; 
        
    return (
        <View className="flex flex-col  ">
            {/* Change Payment Intent */}
           <TouchableOpacity onPress={payment_method_changeable?changePaymentMethod:()=>{}} disabled={!payment_method_changeable||isLoading|| !!error  }>
                <View className="items-baseline">
                    <View className={`${payment_method_changeable?"bg-green-200":"bg-red-200 "} px-2 py-2 rounded-lg  `}> 
                        <Text className={`${payment_method_changeable?"text-green-500":"text-red-500"}`} >
                            {
                                payment_method_changeable
                                ?   isLoading 
                                    ?   <ActivityIndicator color={"black"} /> 
                                    :   <FontAwesome5 name={ride.payment_type=="cash"?"coins":"credit-card"} size={15} color="rgb(34 197 94)" />
                                :<FontAwesome5 name={ride.payment_type=="cash"?"coins":"credit-card"} size={15} color="rgb(239 68 68)" />
                            }
                        </Text>
                    </View> 
                </View>
           </TouchableOpacity>
        </View>
    );
};


interface RideValidatePaymentIntentProps {
    
};

export function RideValidatePaymentIntent({}:RideValidatePaymentIntentProps) {
    const {ride,isLoading,isPaying} = useRideStore();
    const {pay,error} = useValidateRidePaymentIntent(ride!)
    const handlePayment = ()=>{
        if(isLoading)
            return 
        pay()
    } 
    if(
        ride== undefined||ride.payment_type=="cash"|| 
        !ride.payment_intent || !ride.payment_intent.stripe_payment_intent 
        || ride.payment_status!="processing"
    ) 
        return null ; 
    
    return (
        <View className="flex flex-col mt-2 pb-2 ">
            {/* Change Payment Intent */}
           <TouchableOpacity onPress={handlePayment} disabled={isLoading|| !!error  }>
                <View className="items-baseline">
                    <View className={`${!error?"bg-green-200":"bg-red-200 "} px-3 py-1 rounded-lg  `}> 
                        <Text className={`${!error?"text-green-500":"text-red-500"}`} >
                            {
                                isPaying 
                                ?   <ActivityIndicator color={"black"} /> 
                                :   "Pay"
                            }
                        </Text>
                    </View> 
                </View>
           </TouchableOpacity>
        </View>
    );
};
interface RideGeneralInformationsProps {
    
};

export function RideGeneralInformations({}:RideGeneralInformationsProps) {
    const {ride} = useRideStore();
    
    return (
    <View className="flex flex-col ">
        {/* Order timù e+ distance + total in min  */}
        <View className="flex flex-row items-start justify-between py-1 ">
            <View className="flex flex-col items-start justify-center ">
                <Text style={uberFont} className="mb-2 font-bold" >{ride!=undefined && new Date(ride?.ordered_at!).toUTCString()}  </Text>
            </View>
            <View className="flex flex-col items-end justify-center ">
                <Text style={uberFont} className="mb-2 ">{ride!=undefined && ride?.distance} km</Text>
                {/*  */}
                <Text style={uberFont} className="">{ride!=undefined && ride?.total_time}</Text>
            </View>
        </View>
        {/* Ride status + price + addresses */}
        <View className="flex flex-row items-center justify-between py-1 " >
            <View className="flex flex-col ">
                <View className="flex flex-row items-center justify-start"> 
                    <Text style={uberFont} className="text-[12px] py-1" >Ride Status : </Text>
                    {ride!=undefined && (<Ridestatus ride={ride} />)}
                </View>
            
                <Text style={uberFont} className="py-1">{ride!=undefined && new Intl.NumberFormat("fr-FR",{style:"currency",currency:ride!?.currency}).format(ride!?.total)}</Text>
            </View>
            <View className="flex flex-col">
                <View className='flex flex-row items-center justify-end'>
                    <Text style={uberFont} className="py-1 text-[12px]" >From :  </Text>
                    <Text style={uberFont}className="py-1">{ride?.start_address?.formatted_address}</Text>
                </View>
                <View className='flex flex-row items-center justify-end'>
                    <Text style={uberFont} className="py-1 text-[12px]" >To :  </Text>
                    <Text style={uberFont}className="py-1" > {ride?.destination_address?.formatted_address}</Text>
                </View>
            </View>
        </View>
    </View>
    );
};
interface RidePaymentInformationsProps {
    
};

export function RidePaymentInformations({}:RidePaymentInformationsProps) {
    const {ride} = useRideStore();
    
    return (
    <View className="flex flex-row items-center justify-between py-1 ">
        <View className="flex flex-row items-center justify-start "> 
            <Text style={uberFont} className="text-[12px]" >Payment Status : </Text>
            {ride!=undefined && (<Ridepaymentstatus ride={ride} />)}
        </View>
        <View className="flex flex-row items-center justify-center   ">
            <Text style={uberFont}className="text-[12px]" >Payment Type :  </Text>
            <RideChangePaymentMethodButton  /> 
        </View>
    </View>
    );
};

interface RideTimingInformationsProps {
    
};

export function RideTimingInformations({}:RideTimingInformationsProps) {
    const {ride} = useRideStore();
    
    return (
    <View>
        <View className="flex flex-col justify-start  ">
            <View className="flex flex-row items-center justify-start "> 
                {
                    ride!=undefined && ride.ride_status!="cancelled" && (
                    <>
                        <Text style={uberFont}className="text-[12px]" >{ride?.starting_at!=null?"Starting At : ":"Not Started"} </Text>
                        <Text style={uberFont}className="py-1" > 
                            {
                                (ride?.starting_at!=null)&&  new Date(ride?.starting_at).toUTCString()
                            }
                        </Text>
                    </>
                    )
                }
            </View>
            <View className="flex flex-row items-center justify-start  ">
                {
                    ride!=undefined && ride.ride_status!="cancelled" && (
                    <>
                        <Text style={uberFont}className="text-[12px]" >{ride!=undefined && ride?.arrived_at!=null?"Arrived At : ":"Not Arrived"} </Text>
                        <Text style={uberFont}className="py-1" > 
                            {
                                (ride!=undefined && ride?.arrived_at!=null)&&  new Date(ride?.arrived_at).toUTCString()
                            }
                        </Text>
                    </>
                    )
                }
            </View>
        </View>
    </View>
    );
};




interface CurrentRideStatusComponentProps {

};

export function CurrentRideStatusComponent({}:CurrentRideStatusComponentProps) {
    const {isCancelling} = useRideStore(); 
    if(!isCancelling)
        return null ; 
    return (
    <View className="flex flex-row justify-center items-baseline my-1">
        <View className={`flex flex-row items-center py-2 px-3 rounded-lg text-green-500   ${"bg-red-200"}`}>
            <Text className={`${"text-red-500"} mr-2`}>{"Cancelling"}</Text>
            <ActivityIndicator color={`${"rgb(239 68 68)"}`} /> 
        </View>
    </View>
    );
};

interface RideComponentProps {
    ride : Ride 
    stack : GlobalStacks
};

export function RideComponent({ride,stack}:RideComponentProps) {
    const {navigation} = useNavigation()
    const navigateToRide = ()=>{
        navigation.navigate(stack as any,{
            screen:"home_stack",
            params:{
                screen:"ride",
                params:{id:ride.id}
            }
        })
    }
    return (
    <View className="flex flex-col  border border-gray-300 py-3 px-2 my-2 rounded-xl">
        <View className="flex flex-col py-3 px-2  rounded-lg ">
            <TouchableOpacity onPress={navigateToRide}>
                <View className="flex flex-col rounded-lg pb-4 ">
                    <View className="flex flex-row items-center justify-between  mb-2 ">
                        {/*  */}
                        <Text style={uberFont} className="font-bold mb-2" >{new Date(ride.ordered_at).toLocaleString()}</Text>
                        <Ridestatus ride={ride} /> 
                    </View>
                    <View className="flex flex-row items-center justify-between    ">
                        {/* total  */}
                        <Text style={uberFont} className="mb-2">{new Intl.NumberFormat("fr-FR",{style:"currency",currency:ride.currency}).format(ride.total)}</Text>
                        <View className="flex flex-row items-center justify-end"> 
                            <Text style={uberFont} className="text-[14px]" >Payment : </Text>
                            <Ridepaymentstatus ride={ride} />
                        </View>
                    </View>
                    {/* Add */}
                </View>
                <View className="flex flex-row items-center justify-between ">
                    <Text style={uberFont}>{stack=="User"?ride.driver?.user?.name:ride?.user?.name}</Text>
                    <Text style={uberFont}>{ride?.start_address?.name} to {ride?.destination_address?.name}</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
    )
}

export {default as RideHeader} from "./components/RideHeader"