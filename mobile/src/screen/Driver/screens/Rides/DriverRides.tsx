import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { statusBarMargin } from '../../../../styles';
import HeaderStack from '../../../../components/Header/Stack/HeaderStack';
import { RefreshControl } from 'react-native-gesture-handler';
import { useRides } from '../../../User/screens/Rides/hooks/use-rides';
import ErrorComponent from '../../../../components/Error/ErrorComponent';
import { RideComponent } from '../../../../components/Ride';

interface DriverRidesProps {

};

function DriverRides({}:DriverRidesProps) {
    const {data,isLoading,error,refreshing,onRefresh} = useRides() 
   
    if(error)return(
    <RefreshControl className="flex-1 bg-white px-5 py-2 " refreshing={refreshing} onRefresh={onRefresh}  >
        <View className='flex-1' >
            <ErrorComponent data={data} error={error} /> 
        </View>
    </RefreshControl>
    )
    if(isLoading &&!refreshing) return (
    <View className="flex-1 flex flex-col items-center justify-center bg-white ">
        <ActivityIndicator color="black" />
    </View>
    )
    
    return (
    <View className='flex-1 flex bg-white'  style={statusBarMargin}>
        <HeaderStack label="previous rides" /> 
        
        <FlatList 
            data={data.rides}
            keyExtractor={(item)=>item.id}
            className="flex-1 h-full px-3 mb-5 "
            refreshControl={ <RefreshControl className="flex-1 bg-white  border " refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({item:ride})=><RideComponent stack="Driver" ride={ride} />}
        /> 
    </View>
    );
};

export default DriverRides;