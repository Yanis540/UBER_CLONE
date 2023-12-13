import { createStackNavigator } from '@react-navigation/stack';
import {Dimensions} from 'react-native';

import UserHome from '../../../screen/User/screens/Home/UserHome';
import { leftToRightStackAnimation } from '../../util';
import UserRides from '../../../screen/User/screens/Rides/UserRides';
import { useAuth } from '../../../context/store';
import { useNavigation } from '../..';
import UserAddRide from '../../../screen/User/screens/AddRide/UserAddRide';
import UserRide from '../../../screen/User/screens/Ride/UserRide';
import DriverProfile from '../../../screen/User/screens/Driver/DriverProfile';

export type UserHomeStackList ={
  home : undefined 
  rides : undefined 
  ride : {id:string} 
  add_ride : undefined 
  driver : {id:string} 
}


const UserHomeStackNavigator = createStackNavigator<UserHomeStackList>();
function UserHomeStack() {
  const ScreenWidth = Dimensions.get('window').width;
  const {navigation} = useNavigation()
  const {user} = useAuth(); 
  if(!user)
    navigation.navigate("Auth",{screen:"login"})
  return (
  <UserHomeStackNavigator.Navigator
    screenOptions={()=>{
      return {
        animationEnabled:true,
        headerLeft: ()=> null,
        headerShown:false
        // headerTitle:null
      }
    }}
  >
    <UserHomeStackNavigator.Screen name="home" component={UserHome} options={{...leftToRightStackAnimation,headerShown:false}} />
    <UserHomeStackNavigator.Screen name="ride" component={UserRide} options={{...leftToRightStackAnimation,headerShown:false}} />
    <UserHomeStackNavigator.Screen name="rides" component={UserRides} options={{...leftToRightStackAnimation,headerShown:false}} />
    <UserHomeStackNavigator.Screen name="add_ride" component={UserAddRide} options={{...leftToRightStackAnimation,headerShown:false}} />
    <UserHomeStackNavigator.Screen name="driver" component={DriverProfile} options={{...leftToRightStackAnimation,headerShown:false}} />
  </UserHomeStackNavigator.Navigator>
  );
}
export default UserHomeStack