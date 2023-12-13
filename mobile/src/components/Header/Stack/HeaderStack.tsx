import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '../../../routes';
import Header from '../Header';
import { uberFont } from '../../../styles';
import { AntDesign } from '@expo/vector-icons';

interface HeaderStackProps {
    children ?: React.ReactNode
    label ?: string 
};

function HeaderStack({children,label}:HeaderStackProps) {
    const {navigation} = useNavigation();
    const goback = ()=>navigation.canGoBack()&&navigation.goBack()
        
    return (
    <Header >
        <View className="relative flex-1 flex flex-row items-center px-5">
            {/* Left  */}
            <TouchableOpacity onPress={goback}>
                <AntDesign name="left" size={20} color="black" />
            </TouchableOpacity>
            {/* Center */}
            <View className="flex-1 flex flex-col items-center justify-center">
                <Text style={uberFont} className="text-xl font-bold capitalize">{label}</Text>
            </View>
            {/* Right */}
            <View className="relative">
                
                {children}
            </View>
        </View>    
    </Header> 
    );
};

export default HeaderStack;