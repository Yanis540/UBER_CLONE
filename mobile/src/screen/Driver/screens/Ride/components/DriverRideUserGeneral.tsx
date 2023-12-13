import React from 'react';
import { Image, Text, View } from 'react-native'
import { uberFont } from '../../../../../styles';
import { useRideStore } from '../../../../../context/store';

interface DriverRideUserGeneralProps {

};

function DriverRideUserGeneral({}:DriverRideUserGeneralProps) {
    const {ride} = useRideStore()
    return (
    <View className="flex flex-col border-b-[1px] border-b-gray-200 px-3 mt-2 py-2  ">
        <View className="flex flex-row items-center justify-between ">
            {/* Image */}
            <View className="flex flex-row items-center ">
                <View className="w-[32px] h-[32px] ">
                    <Image source={{uri:ride?.user?.photo!}} className="h-full w-full rounded-full" />
                </View>
                <View className="flex flex-col items-start" >
                    <Text style={uberFont} className="font-semibold ml-2 mb-2">{ride?.user?.name} </Text>
                    <Text style={uberFont} className="font-semibold ml-2 mb-2 text-gray-500">{ride?.user?.phone_number} </Text>
                </View>
            </View>
            
        </View>
    </View>
    );
};

export default DriverRideUserGeneral;