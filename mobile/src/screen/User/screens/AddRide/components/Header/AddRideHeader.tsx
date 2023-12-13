import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '../../../../../../routes';
import { AntDesign } from '@expo/vector-icons';
import AutoComplete from '../Input/AutoComplete';
import { useAddRideStore } from '../../context/use-add-ride-store';

interface AddRideHeaderProps {

};

function AddRideHeader({}:AddRideHeaderProps) {
    const {navigation} = useNavigation();
    const goback = ()=>navigation.canGoBack()
        ?   navigation.goBack()
        :   navigation.navigate("User",{
            screen:"home_stack",
            params:{
                screen:"home"
            }
        })
    ;
    const {origin,destination,set_location} = useAddRideStore()
    return (
    <View className="flex flex-row items-center bg-white  absolute px-1  top-0 right-0 w-full z-[100] py-5 ">
        <View className="flex"> 
            <TouchableOpacity onPress={goback}>
                <AntDesign name="left" size={20} color="black" />
            </TouchableOpacity>
        </View>
        {/* Autocommplete */}
        <View className="flex-1 flex flex-col ml-4 relative">
            <AutoComplete 
                setPlaceDetails={(address)=>set_location({address,type:"origin"})} 
                color="blue" 
                placeholder='Origin'
                isEmpty={!(origin)}
                default_text={origin?.address?.formatted_address??""}  
            /> 
            <AutoComplete 
                setPlaceDetails={(address)=>set_location({address,type:"destination"})}  
                color="red" 
                placeholder='Destination'  
                isEmpty={!(destination)}
                default_text={destination?.address?.formatted_address??""}  

            /> 
        </View>
    </View>
    );
};

export default AddRideHeader;