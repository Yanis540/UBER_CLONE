import React from 'react';
import { Image, Text, View } from 'react-native'
import { default_user_img } from '../../styles';

interface RideMarkerProps {
    user : User
};

function RideMarker({user}:RideMarkerProps) {
    return (
    <View className="flex flex-col h-[48px] w-[48px] p-[3px] bg-[rgba(0 0 0 1)] rounded-full   ">
        <Image source={{uri: user?.photo!??default_user_img}} className="w-full h-full rounded-full" /> 
    </View>
    );
};

export default RideMarker;