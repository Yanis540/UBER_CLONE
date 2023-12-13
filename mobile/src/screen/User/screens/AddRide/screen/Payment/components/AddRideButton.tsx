import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useValidateRidePaymentIntent } from '../../../../../../../hooks/rides';

interface AddRideButtonProps {
    ride ?: Ride
    add : ()=>void 
    isAddingRide : boolean 
    redirect : (ride_id : string)=>void 
};

function AddRideButton({ride,add,isAddingRide, redirect}:AddRideButtonProps) {
    const {pay,isPaying,error} = useValidateRidePaymentIntent(ride!);
    const handlePress = async()=>{
        
        if(!ride){
            if(isAddingRide)
                return 
            add()
        }
        else {
            if(isPaying)
                return ; 
            try{
                await pay()
                redirect(ride.id)
            }
            catch(err){

            }
        }
          
    }
    return (
    <View className="flex flex-col items-center justify-center px-5 py-2  bg-black rounded-lg   ">
        <TouchableOpacity onPress={handlePress} disabled={isAddingRide||isPaying}>
            <Text className=" text-[20px] font-bold text-white text-center">
                {
                    isAddingRide
                    ?   <ActivityIndicator color="white" />
                    :   ride==undefined 
                        ?   "Order"  
                        :   isPaying 
                            ?   "Paying"
                            :   "Pay"
                }
            </Text>
        </TouchableOpacity>
    </View>
    );
};

export default AddRideButton;