import React from 'react';
import { View } from 'react-native'
import { 
    CurrentRideStatusComponent,RideGeneralInformations, 
    RidePaymentInformations, RideTimingInformations, 
    RideValidatePaymentIntent 
} from '../../../../../components/Ride/components/RideComponents';

interface UserRideGeneralInformationsProps {
   
};

function UserRideGeneralInformations({}:UserRideGeneralInformationsProps) {

    return (
    <View className="border-b-[1px] border-gray-200">
        <View className=" flex flex-col px-3 mt-2 pb-2  ">

            <RideGeneralInformations /> 

            {/* Payment Status  */}
            <RidePaymentInformations /> 

            <RideValidatePaymentIntent /> 
            {/* Starting time + finishing time  */}
            <RideTimingInformations /> 
            <CurrentRideStatusComponent /> 
        </View>
       
    </View>
    );
};

export default UserRideGeneralInformations;