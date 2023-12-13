import React, { useMemo, useRef} from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native'
import { statusBarMargin,  } from '../../../../styles';
import { useNavigation } from '../../../../routes';
import { useRide } from '../../../../hooks/rides';
import { SafeAreaView, RefreshControl } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';
import ErrorComponent from '../../../../components/Error/ErrorComponent';
import MapRoute from '../../../../components/Map/MapRoute';
import UserRideDriverGeneral from './components/UserRideDriverGeneral';
import { useRideStore } from '../../../../context/store';
import UserRideGeneralInformations from './components/UserRideGeneralInformations';
import { RideHeader } from '../../../../components/Ride';
interface UserRideProps {

};

function UserRide({}:UserRideProps) {
    const {route} = useNavigation()
    const id = (route.params as unknown as  {id:string})?.id!
    const {data,error,isLoading,refreshing,onRefresh} = useRide(id);
    const {ride} = useRideStore()  
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    // variables
    const snapPoints = useMemo(() => ['3%', '50%'], []);
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
        <SafeAreaView className="flex-1 flex flex-col bg-white  py-2 ">
            <RideHeader />
            {/* Map of ride  */}
            <ScrollView className=""> 
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
                <UserRideGeneralInformations  />
                <UserRideDriverGeneral  />
                 
            </ScrollView>
       
        </SafeAreaView>
    </RefreshControl>
    );
};

export default UserRide;