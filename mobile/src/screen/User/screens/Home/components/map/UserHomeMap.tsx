import { Text, View ,} from 'react-native'
import { uberFont } from '../../../../../../styles';
import MapMarkers from '../../../../../../components/Map/MapMarkers';
import { DriverMarker } from '../../../../../../components/Markers';
import { useAuth, useLocalisationStore } from '../../../../../../context/store';
import { useBottomSheetModalSelectedMarkerOnMap } from '../../../../../../hooks/maps';
import SelectedDriverBottomSheet from './components/SelectedDriverBottomSheet';

interface UserHomeMapProps {
    drivers : Driver []
    presentModal : (driver_id : string)=>void 
};

function UserHomeMap({drivers,presentModal}:UserHomeMapProps) {
    const {localisation} = useLocalisationStore();
    const {user} = useAuth()
    const markers: MapMarker []= 
        !drivers
        ?   [] 
        :   drivers.map((driver)=>({
                localisation:driver.user.localisation!,
                title:driver.user.email,
                name:driver.user.name,
                Marker : ()=><DriverMarker driver={driver} />, 
                onPress:()=>{
                    if(user?.id == driver.licence_id )
                        return ; 
                    presentModal(driver.licence_id)
                }
            }
        ));
    markers.push({
        localisation:localisation!,
        title:"You",name:user!?.name
    })
    return (
    <View className="flex-1 flex flex-col ">
        <Text style={uberFont} className="my-5 font-bold text-lg">Around you </Text>
        <View className="flex-1  ">
       
            <MapMarkers 
                markers={markers} 
                can_fit_markers={false} 
                draw_road={false} 
            />
           

        </View>
    </View>
    );
};

export default UserHomeMap;