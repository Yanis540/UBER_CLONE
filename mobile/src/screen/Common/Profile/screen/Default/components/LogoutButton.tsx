import React from 'react';
import { Text, View , TouchableOpacity} from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '../../../../../../routes';
import { useAuth } from '../../../../../../context/store';

interface LogoutButtonProps {

};

function LogoutButton({}:LogoutButtonProps) {
    const {navigation} = useNavigation()

    const {user,set_user} = useAuth()
    const handleLogout = ()=>{
        set_user()
        navigation.navigate("Auth")
    }

    return (
    <View className="mx-auto mb-2">
        <TouchableOpacity onPress={handleLogout}>
            <View className="flex flex-row items-center  bg-black px-5 py-2 mb-4 rounded-2xl ">
                <Entypo name="log-out" size={20} color="white" />
                <Text className="text-white text-[18px] ml-2" >Log Out</Text>
            </View>
        </TouchableOpacity>
    </View>
    );
};

export default LogoutButton;