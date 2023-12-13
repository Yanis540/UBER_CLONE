import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { uberFont } from '../../../../../../../styles';
import { calculate_total_ride } from '../../util';
import { useAddRideStore } from '../../../context/use-add-ride-store';
import { useAuth } from '../../../../../../../context/store';
import { useAddRideNavigation } from '../../../routes';

interface RideDetailsProps {

};

function RideDetails({}:RideDetailsProps) {
    const {route} = useAddRideNavigation();
    const {additionnal,car_type,price_per_km,traffic_coef} = route.params!; 
    const {informations,origin,destination,payment_type,set_payment_type} = useAddRideStore(); 
    const total = useMemo(()=>
        calculate_total_ride({additionnal,price_per_km,traffic_coef,distance:informations!?.distance}),
        [informations,additionnal,price_per_km,traffic_coef]
    )
    const currency = "usd"; 
    const changePaymentMethod = ()=>set_payment_type((!payment_type?"cash":payment_type=="cash"?"card":"cash") as PaymentType )
    return (
    <View className=" flex flex-col px-3" >
        <View className="flex flex-row items-center justify-between py-1 " >
            <View className="flex flex-row items-center py-1  ">
                <Text style={uberFont} className="text-[16px]">From : </Text>
                <Text style={uberFont} className="text-[16px] font-bold">{origin!?.address.formatted_address}</Text>
            </View>
        </View>
        <View className="flex flex-row items-center justify-between py-1 " >
            <View className="flex flex-row items-center py-1 ">
                <Text style={uberFont} className="text-[16px]">To : </Text>
                <Text style={uberFont} className="text-[16px] font-bold">{destination!?.address.formatted_address}</Text>
            </View>
        </View>
        <View className="flex flex-row items-center justify-between py-1 " >
            <View className="flex flex-row items-center py-1 ">
                <Text style={uberFont} className="text-[16px]">Car Type : </Text>
                <Text style={uberFont} className="text-[16px] font-bold capitalize">{car_type}</Text>
            </View>
        </View>
        <View className="flex flex-row items-center justify-between py-1 " >
            <View className="flex flex-row items-center py-1 ">
                <Text style={uberFont} className="text-[16px]">Distance : </Text>
                <Text style={uberFont} className="text-[16px] font-bold">{Math.round(informations!?.distance)} km </Text>
            </View>
            <View className="flex flex-row items-center py-1 ">
                <Text style={uberFont} className="text-[16px]">Time : </Text>
                <Text style={uberFont} className="text-[16px] font-bold">{Math.round(informations!?.time)} min </Text>
            </View>
        </View>
        <View className="flex flex-row items-center justify-between py-1" >
            <View className="flex flex-row items-center py-1 ">
                <Text style={uberFont} className="text-[16px]">Total Price : </Text>
                <Text style={uberFont} className="text-[16px] font-bold">{new Intl.NumberFormat("fr-FR",{style:"currency",currency:currency}).format(total)} </Text>
            </View>
            <View className="flex flex-row items-center">
                <Text style={uberFont} className="text-[16px]">Method : </Text>
                <View className="bg-green-200 px-3 py-1  rounded-lg ml-1" >
                    <TouchableOpacity onPress={changePaymentMethod}>
                        <Text style={uberFont} className={"text-[16px] text-green-500 "}>{payment_type}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
    );
};

export default RideDetails;