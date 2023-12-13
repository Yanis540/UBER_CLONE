import { createStackNavigator } from '@react-navigation/stack';
import {Dimensions} from 'react-native';

// import Home from '../../../screen//Home/Home';
import { leftToRightStackAnimation } from '../../util';
import Profile from '../../../screen/Common/Profile/screen/Default/Profile';
import ProfileDetails from '../../../screen/Common/Profile/screen/Details/ProfileDetails';
import ProfilePassword from '../../../screen/Common/Profile/screen/Password/ProfilePassword';
export type ProfileStackList ={
  profile : undefined // here show bottom navigation when longpressing on the image 
  profile_details : undefined // update name or  address
  profile_password : undefined  
}


const ProfileStackNavigator = createStackNavigator<ProfileStackList>();
function ProfileStack() {
  const ScreenWidth = Dimensions.get('window').width;
  return (
  <ProfileStackNavigator.Navigator
    screenOptions={()=>{
      return {
        animationEnabled:true,
        headerLeft: ()=> null,
        headerShown:false
        // headerTitle:null
      }
    }}
  >
    <ProfileStackNavigator.Screen name="profile" component={Profile} options={{...leftToRightStackAnimation,headerShown:false}} />
    <ProfileStackNavigator.Screen name="profile_details" component={ProfileDetails} options={{...leftToRightStackAnimation,headerShown:false}} />
    <ProfileStackNavigator.Screen name="profile_password" component={ProfilePassword} options={{...leftToRightStackAnimation,headerShown:false}} />
  </ProfileStackNavigator.Navigator>
  );
}
export default ProfileStack