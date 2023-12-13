import React from 'react';
import { Text, View } from 'react-native'
import { useAuth, useSocketStore } from '../../../../../context/store';
import { uberFont } from '../../../../../styles';
import { Avatar } from '../../../../../components/Avatar';
import { getTime } from '../../../../../util/time';
import { Entypo } from '@expo/vector-icons';

interface DriverHomeHeaderProps {

};

function DriverHomeHeader({}:DriverHomeHeaderProps) {
    const {user} = useAuth(); 
    const {number_units_time, unit_time} = getTime(user?.created_at!);
    const {socket} = useSocketStore()
    const handleOnPress = ()=>{
        socket?.emit<EmitSocketEvents>("driver:is-available",{isAvailable: !(user?.driver?.isAvailable)})
    } 

    return (
    <View className="flex flex-col  py-4 px-3 rounded-b-xl bg-black">
        <View className="flex flex-col items-center justify-center">
            <Avatar 
                src={user?.photo} 
                isOnline={user?.driver?.isAvailable} 
                show_status 
                onPress ={handleOnPress}
            /> 
        </View>
        <View className="flex flex-col">
            <View className="flex flex-col items-center justify-center mt-2">
                <Text style={uberFont} className="font-semibold text-white text-[16px]">{user?.name}</Text>
            </View>
            <View className="flex flex-col items-center justify-center mt-2 ">
                <Text style={uberFont} className=" text-[14px] text-gray-400">{user?.driver?.cars?.[0]!?.car_model} - {user?.driver?.cars?.[0]!?.car_id}</Text>
            </View>
            <View className="flex flex-col items-center justify-center mt-2 ">
                <Text style={uberFont} className="font-semibold ml-1 capitalize text-gray-400 ">{user?.driver?.cars?.[0]?.car_type}</Text>
            </View>
        </View>
        <View className="flex flex-row items-center justify-between px-2 pt-2"> 
            <View className='flex flex-col items-center'>
                <Text style={uberFont} className="font-semibold text-[21px] py-1 text-white">{user?.driver?._count?.rides} </Text>
                <Text style={uberFont} className="font-semibold text-[13px] text-gray-400">Trip</Text>
            </View>
            <View className='flex flex-col items-center'>
                <View className="flex flex-row items-center py-1">
                    <Text style={uberFont} className="flex flex-col items-center font-semibold text-[21px] text-white">{user?.driver?.total_rating} </Text>
                    <Entypo name="star" size={24} color="white"/>
                </View>
                <Text style={uberFont} className="font-semibold text-[13px] text-gray-400">Rating</Text>
            </View>
            <View className='flex flex-col items-center'>
                <Text style={uberFont} className="font-semibold text-white text-[21px] py-1">{number_units_time}</Text>
                <Text style={uberFont} className="font-semibold text-gray-400 text-[13px] ">{unit_time}</Text>
            </View>
        </View>
    </View>

    );
};

export default DriverHomeHeader;