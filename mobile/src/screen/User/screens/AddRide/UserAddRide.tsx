import { View } from 'react-native'
import { statusBarMargin } from '../../../../styles';
import MapMarkers from '../../../../components/Map/MapMarkers';
import AddRideStack from './routes/Stack/AddRideStack';
import { useAddRideStore } from './context/use-add-ride-store';
import AddRideHeader from './components/Header/AddRideHeader';
interface UserAddRideProps {

};

type AddRideStack = {
    ride_payment_details ?: undefined // add options for premium cars or 
    ride_confirm  ?: undefined 
}

function UserAddRide({}:UserAddRideProps) {
    
    const {origin,destination,set_informations} = useAddRideStore()
    const markers:AddressMarker[] = ([origin,destination].filter((marker)=>marker!=undefined) as AddressMarker[])
    return (
    <View className="flex-1 flex bg-white " style={statusBarMargin}>
        <View className='flex-1 flex'>
            {/* look up  */}
            <AddRideHeader /> 
            <View className="flex-1">
                <MapMarkers
                    markers={markers} 
                    setRideData={set_informations}
                /> 
            </View>
            <AddRideStack />
        </View>
    </View>
    );
};

export default UserAddRide;