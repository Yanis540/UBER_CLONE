
import React, { useRef } from 'react';
import { SafeAreaView, RefreshControl, ScrollView, Text } from 'react-native'
import UserHomeHeader from './components/UserHomeHeader';
import { useGetUser } from '../../../../hooks';
import UserHomeNavigation from './components/UserHomeNavigation';
import UserHomeMap from './components/map/UserHomeMap';
import { statusBarMargin } from '../../../../styles';
import { useDriversNearby } from './hooks/use-drivers-nearby';
import { useBottomSheetModalSelectedMarkerOnMap } from '../../../../hooks/maps';
import SelectedDriverBottomSheet from './components/map/components/SelectedDriverBottomSheet';
import { useUpdateDriverLocalisation } from './hooks/use-update-driver-localisation';
interface UserHomeProps {

};

function UserHome({}:UserHomeProps) {
    const {refreshing,onRefresh}= useGetUser();
    const {data,refreshing:refreshingDrivers,onRefresh:onRefreshDrivers} = useDriversNearby();
    const {bottomSheetModalRef,selectedRef,presentModal} = useBottomSheetModalSelectedMarkerOnMap<string>()
    useUpdateDriverLocalisation()

    return (
    <RefreshControl className="flex-1 bg-white " refreshing={refreshing||refreshingDrivers} onRefresh={()=>{onRefresh();onRefreshDrivers();}}  style={statusBarMargin}>
        <ScrollView className="flex-1 flex flex-col bg-white px-5 py-2 relative  " contentContainerStyle={{ flexGrow: 1 }}>
            <UserHomeHeader />
            <UserHomeNavigation /> 
            <UserHomeMap presentModal={presentModal} drivers={data.drivers} />
        </ScrollView>
        <SelectedDriverBottomSheet 
            bottomSheetModalRef = {bottomSheetModalRef}
            driverIdRef={selectedRef}
        /> 
    </RefreshControl>
    );
};

export default UserHome;