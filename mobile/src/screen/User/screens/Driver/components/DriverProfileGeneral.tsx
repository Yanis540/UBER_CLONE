import React, { useMemo } from 'react';
import { Text, View, } from 'react-native'
import { uberFont } from '../../../../../styles';
import { useAuth, useDriverStore } from '../../../../../context/store';
import RatingComponent from '../../../../../components/Rating/RatingComponent';
import { Entypo } from '@expo/vector-icons';
import moment from "moment"
import { useDriverRating } from '../../../../../hooks';
import { Avatar } from '../../../../../components/Avatar';
import { getTime } from '../../../../../util/time';
interface DriverProfileGeneralProps {
    onLongPress: ()=>void  
};

function DriverProfileGeneral({onLongPress}:DriverProfileGeneralProps) {
    const {driver, set_driver} = useDriverStore(); 
    const {user} = useAuth();
    const user_rating_on_driver = useMemo(()=>
        user?.ratings.filter((rating)=>rating.licence_id== driver?.licence_id),
        [user?.ratings?.length]
    ); 
    const update_driver = (driver_infos:Driver)=>{
        set_driver(driver_infos); 
    }
    const {rate} = useDriverRating(driver?.licence_id??"",update_driver); 
    const {number_units_time, unit_time} = getTime(driver?.user.created_at!); 
    return (
    <View className="flex flex-col px-5 bg-white">
        {/* User General Informations */}
        <View className="flex flex-col items-center justify-between pt-2 pb-5" >
            <Avatar onLongPress={onLongPress} src={driver?.user?.photo} /> 
            <View className="flex flex-col">
                <View className="flex flex-col items-center justify-center mt-2">
                    <Text style={uberFont} className="font-semibold text-[16px]">{driver?.user?.name}</Text>
                </View>
                <View className="flex flex-col items-center justify-center mt-2 ">
                    <Text style={uberFont} className=" text-[14px] text-gray-500">{driver?.cars?.[0]!?.car_model} - {driver?.cars?.[0]!?.car_id}</Text>
                </View>
                <View className="flex flex-col items-center justify-center mt-2 ">
                    <Text style={uberFont} className="font-semibold ml-1 capitalize text-gray-500 ">{driver?.cars?.[0]?.car_type}</Text>
                </View>
            </View>
        </View>
        {/* Ratings && stuff */}
        <View className="flex flex-row items-center justify-between px-2 pt-2"> 
            <View className='flex flex-col items-center'>
                <Text style={uberFont} className="font-semibold text-[21px] py-1">{driver?._count?.rides} </Text>
                <Text style={uberFont} className="font-semibold text-[13px] text-gray-500">Trip</Text>
            </View>
            <View className='flex flex-col items-center'>
                <View className="flex flex-row items-center py-1">
                    <Text style={uberFont} className="flex flex-col items-center font-semibold text-[21px] ">{driver?.total_rating} </Text>
                    <Entypo name="star" size={24} color="black"/>
                </View>
                <Text style={uberFont} className="font-semibold text-[13px] text-gray-500">Rating</Text>
            </View>
            <View className='flex flex-col items-center'>
                <Text style={uberFont} className="font-semibold text-[21px] py-1">{number_units_time}</Text>
                <Text style={uberFont} className="font-semibold text-[13px] text-gray-500">{unit_time}</Text>
            </View>
        </View>
        {/* Some related stuff to driver */}
        <View className="flex flex-col px-2 pt-2">
            <View className="flex flex-row items-center py-2" >
                <Text style={uberFont} className="font-semibold text-gray-500">Licence ID :</Text>
                <Text style={uberFont} className="font-semibold ml-1 text-[13px] ">{driver?.licence_id} </Text>
            </View>
            <View className="flex flex-row items-center py-2" >
                <Text style={uberFont} className="font-semibold text-gray-500">Phone :</Text>
                <Text style={uberFont} className="font-semibold ml-1 text-[13px] ">{driver?.user?.phone_number} </Text>
            </View>
            <View className="flex flex-row items-center py-2" >
                <Text style={uberFont} className="font-semibold text-gray-500">Address :</Text>
                <Text style={uberFont} className="font-semibold ml-1 text-[13px] ">{driver?.user?.address} </Text>
            </View>
        </View>
 
        <View className="flex flex-row items-center justify-between py-2  ">
            <View className="flex flex-row  items-end " >
                <Text style={uberFont} className="font-semibold text-golden-yellow">
                    {driver?._count.rides} {((driver!?._count?.rides==0) || (driver!?._count?.rides == 1))?"Ride":"Rides" }
                </Text>
            </View>
            <View className="flex flex-row items-center justify-end   ">
                <RatingComponent 
                    driver={driver!} 
                    rating={user_rating_on_driver?.[0]?.rating??0} 
                    rate={rate} 
                /> 
            </View>
        </View>
        {/* Localisation */}
        
        
    </View>
    );
};

export default DriverProfileGeneral;