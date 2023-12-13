import React, { useCallback, useRef } from 'react';
import { RefreshControl , View } from 'react-native'
import { statusBarMargin } from '../../../../styles';
import { useNearbyRides } from './hooks/use-nearby-rides';
import ErrorComponent from '../../../../components/Error/ErrorComponent';
import RidesNearbyHeader from './components/RidesNearbyHeader';
import MapMarkers from '../../../../components/Map/MapMarkers';
import { RideMarker } from '../../../../components/Markers';
import {BottomSheetModal as GorhomBottomSheetModal,} from '@gorhom/bottom-sheet';
import SelectedRideNearbyInformations from './components/SelectedRideNearbyInformations';
import { useBottomSheetModalSelectedMarkerOnMap } from '../../../../hooks/maps';

interface DriverRidesNearbyProps {

};

function DriverRidesNearby({}:DriverRidesNearbyProps) {
    const {bottomSheetModalRef,selectedRef,presentModal} = useBottomSheetModalSelectedMarkerOnMap<string>()
    const {data,isLoading,error,refreshing,onRefresh,refresh}=useNearbyRides(); 
    const {rides} = data;
    const markers:RideMapMarker []=rides.map((ride)=>({
        address:ride.start_address,
        title : ride.user?.name,
        ride_id:ride.id, 
        Marker : ()=><RideMarker user={ride.user} />, 
        onPress: (mapMarker:RideMapMarker)=>{
            presentModal(mapMarker.ride_id)
        }  
    })) 

    if(error)return(
        <RefreshControl className="flex-1 bg-white px-5 py-2 " refreshing={refreshing} onRefresh={onRefresh}  >
            <View className='flex-1' >
                <ErrorComponent data={data} error={error} /> 
            </View>
        </RefreshControl>
    )
    return (
    <View className="flex-1 flex flex-col bg-white relative " style={statusBarMargin}>
        {/* Header  */}
        <RidesNearbyHeader /> 
        <View className="flex-1 relative ">
            <MapMarkers 
                markers={markers as any } 
                can_fit_markers={true} 
                draw_road={false} 
                onZoomOut={(radius:number)=>{
                    if(radius>5)
                        refresh({radius})
                }}
            />
        </View>
        <SelectedRideNearbyInformations 
            bottomSheetModalRef={bottomSheetModalRef} 
            rideIdRef={selectedRef}

        /> 

    </View>
    );
};

export default DriverRidesNearby;