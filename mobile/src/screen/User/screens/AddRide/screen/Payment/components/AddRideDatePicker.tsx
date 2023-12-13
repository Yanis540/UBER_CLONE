import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { uberFont } from '../../../../../../../styles';
import DateTimePicker,{ DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { useAddRideStore } from '../../../context/use-add-ride-store';

interface AddRideDatePickerProps {
    open : ()=> void
    isOpen : boolean  
    setDate : (event:DateTimePickerEvent,date?:Date)=> void 
};

function AddRideDatePicker({open,isOpen,setDate}:AddRideDatePickerProps) {
    const {starting_at : date} = useAddRideStore() 
    return (
    <View className="flex ">
        <View className="flex flex-row items-center justify-end " >
            <View className="flex flex-row justify-center bg-white border-[1px] border-gray-400  p-2 rounded-lg ">
                <TouchableOpacity onPress={open}>
                    <View className="flex flex-row justify-center">
                        <AntDesign name="clockcircle" size={18} color="black"  />
                        <Text style={uberFont} className="text-black ml-2 text-[11px]">

                            {
                                !date 
                                ? "Now"
                                : `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            {
                isOpen &&(
                    <DateTimePicker 
                        value={date?? new Date()} onChange={setDate}  
                        minimumDate={new Date()} mode="datetime" 
                    />
                )
            }
        </View>
    </View>
    );
};

export default AddRideDatePicker;