import React from 'react';
import { ScrollView, Text, TouchableOpacity, View,RefreshControl } from 'react-native'
import { statusBarMargin } from '../../../../styles';
import DriverHomeHeader from './components/DriverHomeHeader';
import Routes from '../../../../components/Routes/Routes';
import { useDriverRoutes } from './hooks/use-driver-routes';
import { useAuth } from '../../../../context/store';
import { useGetUser } from '../../../../hooks';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '../../../../routes';

interface DriverHomeProps {

};

function DriverHome({}:DriverHomeProps) {
    const routes = useDriverRoutes(); 
    const {refreshing,onRefresh}= useGetUser();
    return (
    <RefreshControl className="flex-1 bg-white " refreshing={refreshing} onRefresh={onRefresh}  style={statusBarMargin}>
        <ScrollView className="flex-1 flex bg-white  " >
           {/* some stats and all of that */}
            <DriverHomeHeader /> 
            <CurrentRide /> 
            <Routes routes={routes} /> 
        </ScrollView>
    </RefreshControl>
    );
};



function CurrentRide (){
    const {navigation} = useNavigation(); 
    const {user} = useAuth(); 
    const currentRide = (user?.driver && user?.driver?.rides?.length!=0)&& (user.driver.rides[0]); // it contains the current ride 
    if(!currentRide)
        return ;
    const navigateToCurrentRide = ()=>navigation.navigate(
        "Driver",{
            screen:"home_stack",
            params:{
                screen:"ride",
                params:{id:currentRide.id}
            }
        }
    )
    return (
        <TouchableOpacity onPress={navigateToCurrentRide}>
            <View className="flex flex-row items-center justify-between px-5 py-3 " >
                <Text className="font-semibold text-lg">Current ride</Text>
                <AntDesign name="right" size={18} color="black" />
            </View>
        </TouchableOpacity>
    )
}

export default DriverHome;