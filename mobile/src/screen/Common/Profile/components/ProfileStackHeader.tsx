import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '../../../../routes';
import Header from '../../../../components/Header/Header';
import { AntDesign } from '@expo/vector-icons';
import { uberFont } from '../../../../styles';

interface ProfileStackHeaderProps {
    children ?: ReactNode |ReactNode[] 
    label ?: string 
};

function ProfileStackHeader({children,label}:ProfileStackHeaderProps) {
    const {navigation} = useNavigation();
    const goback = ()=>navigation.canGoBack()
        ?   navigation.goBack()
        :   navigation.navigate("User",{
            screen:"profile_stack",
            params:{
                screen:"profile"
            }
            
        })
    ;
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

export default ProfileStackHeader;