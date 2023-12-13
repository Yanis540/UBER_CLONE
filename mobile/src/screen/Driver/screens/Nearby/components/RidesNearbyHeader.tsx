import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '../../../../../routes';
import { AntDesign } from '@expo/vector-icons';

interface RidesNearbyHeaderProps {

};

function RidesNearbyHeader({}:RidesNearbyHeaderProps) {
    const {navigation} = useNavigation();
    const goback = ()=>navigation.canGoBack() && navigation.goBack()
    return (
    <View className='absolute top-2 left-2 z-[9999]'>
        <TouchableOpacity onPress={goback}>
            <AntDesign name="left" size={28} color="white" style={{fontWeight:"bold"}} />
        </TouchableOpacity>
    </View>
    );
};

export default RidesNearbyHeader;