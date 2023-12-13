import { createStackNavigator } from '@react-navigation/stack';
import { leftToRightStackAnimation } from '../../util';
import DriverHome from '../../../screen/Driver/screens/Home/DriverHome';
import DriverRides from '../../../screen/Driver/screens/Rides/DriverRides';
import DriverRide from '../../../screen/Driver/screens/Ride/DriverRide';
import DriverRidesNearby from '../../../screen/Driver/screens/Nearby/DriverRidesNearby';
import DriverCars from '../../../screen/Driver/screens/Cars/DriverCars';
import { useDriverSockets } from './hooks/use-driver-sockets';

export type DriverHomeStackList ={
  home : undefined 
  rides : undefined 
  ride : {id:string} 
  rides_nearby : undefined
  cars : undefined
}


const DriverHomeStackNavigator = createStackNavigator<DriverHomeStackList>();
function DriverHomeStack() {
  useDriverSockets(); 
  return (
  <DriverHomeStackNavigator.Navigator
    screenOptions={()=>{
      return {
        animationEnabled:true,
        headerLeft: ()=> null,
        headerShown:false
        // headerTitle:null
      }
    }}
  >
    <DriverHomeStackNavigator.Screen name="home" component={DriverHome} options={{...leftToRightStackAnimation,headerShown:false}} />
    <DriverHomeStackNavigator.Screen name="rides" component={DriverRides} options={{...leftToRightStackAnimation,headerShown:false}} />
    <DriverHomeStackNavigator.Screen name="ride" component={DriverRide} options={{...leftToRightStackAnimation,headerShown:false}} />
    <DriverHomeStackNavigator.Screen name="rides_nearby" component={DriverRidesNearby} options={{...leftToRightStackAnimation,headerShown:false}} />
    <DriverHomeStackNavigator.Screen name="cars" component={DriverCars} options={{...leftToRightStackAnimation,headerShown:false}} />
  </DriverHomeStackNavigator.Navigator>
  );
}
export default DriverHomeStack