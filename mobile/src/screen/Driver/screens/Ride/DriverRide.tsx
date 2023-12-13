import React from 'react';
import { Text, View,RefreshControl,ActivityIndicator,SafeAreaView,ScrollView } from 'react-native'
import { statusBarMargin } from '../../../../styles';
import { useNavigation } from '../../../../routes';
import { useAuth, useRideStore } from '../../../../context/store';
import { useRide, useRideStatus } from '../../../../hooks/rides';
import ErrorComponent from '../../../../components/Error/ErrorComponent';
import MapRoute from '../../../../components/Map/MapRoute';
import { RideGeneralInformations, RideHeader, RidePaymentInformations, RideTimingInformations } from '../../../../components/Ride/components/RideComponents';
import UpdateRideStatusButton from './components/UpdateRideStatusButton';
import DriverRideUserGeneral from './components/DriverRideUserGeneral';
import DriverRideGeneralInformations from './components/DriverRideGeneralInformations';

interface DriverRideProps {

};

function DriverRide({}:DriverRideProps) {
    const {route} = useNavigation(); 
    const {user} = useAuth();
    const id = (route.params as unknown as  {id:string})?.id!
    const {data,error,isLoading,refreshing,onRefresh} = useRide(id);
    const {accept,start,end} = useRideStatus();
    
    const {ride} = useRideStore()  
    
    const isDriver =(ride?.driver) &&(ride?.driver?.licence_id == user?.id) 
    if(error|| (!isLoading && !refreshing && !ride))return(
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
    <RefreshControl className="flex-1 bg-white " refreshing={refreshing} onRefresh={onRefresh}  style={statusBarMargin}>
        <ScrollView contentContainerStyle={{flexGrow: 1}} className="flex-1 flex flex-col bg-white  py-2 ">
            <RideHeader />
            {/* Map of ride  */}
            <View className="flex-1"> 
                <View className="h-[200px] ">
                {
                    ride!=undefined && (
                        <MapRoute 
                            start_address={ride.start_address} 
                            destination_address={ride.destination_address} 
                        /> 
                    ) 
                }
                </View>
                <DriverRideGeneralInformations /> 
                <DriverRideUserGeneral /> 

                <View className="flex-1 flex flex-col items-center justify-end ">
                    <UpdateRideStatusButton /> 
                </View>
            </View>
       
        </ScrollView>
    </RefreshControl>
    );
};

export default DriverRide;