import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useRideStore } from '../../../../../context/store';
import { useRideStatus } from '../../../../../hooks/rides';
import { uberFont } from '../../../../../styles';

interface UpdateRideStatusButtonProps {

};

function UpdateRideStatusButton({}:UpdateRideStatusButtonProps) {
    const {ride} = useRideStore();
    const {start,accept,end} = useRideStatus()
    const options:{message:string,onPress: (data?:any)=>void,isLoading?:boolean} = ride?.ride_status=="proposed"
        ?   {message:"Accept",isLoading:accept.isLoading,onPress:accept.accept}
        :   ride?.ride_status=="accepted"
            ?   {message:"Start",isLoading:start.isLoading,onPress:start.start}
            :   ride?.ride_status =="progress"
                ?   {message:"End",isLoading:end.isLoading,onPress:end.end}
                :   {message:"idk",onPress:()=>{}}
    if(ride?.ride_status == "finished" || ride?.ride_status == "cancelled")
        return null; 
    return (
    <View className="items-baseline">
        <TouchableOpacity className='' onPress={options.onPress}>

            <View  className="flex flex-col items-center py-1 px-4  rounded-lg bg-black">
                {
                    options?.isLoading?(
                        <ActivityIndicator color="white"/> 
                    ):(
                        <Text style={uberFont} className="text-white text-lg">{options.message}</Text>
                    )
                }
            </View>
        </TouchableOpacity>
    </View>
    );
};

export default UpdateRideStatusButton;