import React, { useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { uberFont } from '../../../../../styles';
import {Ridestatus,Ridepaymentstatus} from '../../../../../components/Ride';
import { useNavigation } from '../../../../../routes';
import MapRoute from '../../../../../components/Map/MapRoute';
interface UserRideComponentProps {
    ride : Ride 
};

function UserRideComponent({ride}:UserRideComponentProps) {
    const {navigation} = useNavigation()
    const navigateToRide = ()=>{
        navigation.navigate("User",{
            screen:"home_stack",
            params:{
                screen:"ride",
                params:{id:ride.id}
            }
        })
    }
    return (
    <View className="flex flex-col  border border-gray-300 py-3 px-2 my-2 rounded-xl">
        <View className="flex flex-col mb-2 py-3 px-2 border border-gray-100 rounded-lg ">
            <TouchableOpacity onPress={navigateToRide}>
                <View className="flex flex-col rounded-lg  mb-2">
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
                <View>

                </View>
                <Text style={uberFont}>{ride.driver?.user?.name}</Text>

            </TouchableOpacity>
        </View>
        <View className="flex-1 h-[100px] ">
            {/* Map */}
            <MapRoute 
                start_address={ride.start_address} 
                destination_address={ride.destination_address} 
            />
        </View>
    </View>
    )
}

export default UserRideComponent;