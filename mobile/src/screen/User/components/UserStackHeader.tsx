import React from 'react';
import { Text, View , TouchableOpacity } from 'react-native'
import Header from '../../../components/Header/Header';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '../../../routes';
import { uberFont } from '../../../styles';

interface UserStackHeaderProps {
    children ?: React.ReactNode
    label ?: string 

};

function UserStackHeader({label,children}:UserStackHeaderProps) {
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

export default UserStackHeader;