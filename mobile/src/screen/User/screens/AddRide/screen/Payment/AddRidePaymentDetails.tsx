import React, { useMemo, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { useAddRideNavigation } from '../../routes';
import { calculate_total_ride } from '../util';
import { useAddRideStore } from '../../context/use-add-ride-store';
import { useAuth } from '../../../../../../context/store';
import { uberFont } from '../../../../../../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RideDetails from './components/RideDetails';
import { Feather } from '@expo/vector-icons';
import { useAddRide } from './hooks/use-add-ride';
import AddRideButton from './components/AddRideButton';
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AddRideDatePicker from './components/AddRideDatePicker';

interface AddRidePaymentDetailsProps {

};

function AddRidePaymentDetails({}:AddRidePaymentDetailsProps) {
    const {route} = useAddRideNavigation();
    const {navigation} = useAddRideNavigation()
    const {data,isLoading,add,redirect} =useAddRide(); 
    const {additionnal,price_per_km,traffic_coef} = route.params!; 
    const {informations,set_starting_at} = useAddRideStore(); 
    const [isDateTimePickerOpen,setIsDateTimePickerOpen] = useState<boolean>(false); 
    const openDateTimePicker = ()=>setIsDateTimePickerOpen(true);
    const closeDateTimePicker = ()=>setIsDateTimePickerOpen(false);

    const handleSetDate = (event:DateTimePickerEvent,date?:Date)=>{
        const {
            type,
            nativeEvent,
        } = event;
        if(date)
            if(Platform.OS != "ios")
                DateTimePickerAndroid.open({
                    mode: 'time',
                    value: date,
                    onChange: (_, newDateTime) => {
                        if (newDateTime) {
                            set_starting_at(newDateTime);              
                        }
                    },
                });
            else 
                set_starting_at(date); 
        return closeDateTimePicker(); 
    }
    const total = useMemo(()=>
        calculate_total_ride({additionnal,price_per_km,traffic_coef,distance:informations!?.distance}),
        [informations,additionnal,price_per_km,traffic_coef]
    )
    const currency = "usd"; 
    return (
    <SafeAreaView className="flex-1 justify-between py-2 bg-white ">
        <ScrollView className="flex-1  " contentContainerStyle={{flexGrow:1}}>
            <View className="flex flex-row items-center justify-between ">
                <View className="">
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Feather name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <AddRideDatePicker 
                    open={openDateTimePicker} isOpen={isDateTimePickerOpen}
                    setDate={handleSetDate} 
                /> 
            </View>
            <RideDetails /> 
            <View className='flex-1 flex justify-end px-3 '>
                <AddRideButton 
                    add={()=>{add({total})}} 
                    isAddingRide={isLoading} 
                    ride={data.ride}
                    redirect={redirect}
                />
            </View>
        </ScrollView>
    </SafeAreaView>
    );
};

export default AddRidePaymentDetails;