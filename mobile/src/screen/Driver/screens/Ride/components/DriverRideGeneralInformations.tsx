import React from 'react';
import { Text, View } from 'react-native'
import { RideGeneralInformations, RidePaymentInformations, RideTimingInformations } from '../../../../../components/Ride';

interface DriverRideGeneralInformationsProps {

};

function DriverRideGeneralInformations({}:DriverRideGeneralInformationsProps) {
    return (
    <View className="border-b-[1px] border-gray-200">
        <View className=" flex flex-col px-3 mt-2 pb-2  ">
            <RideGeneralInformations /> 
            <RideTimingInformations /> 
            <RidePaymentInformations /> 
        </View>
    </View>
    );
};

export default DriverRideGeneralInformations;