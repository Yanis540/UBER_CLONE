
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../context/store';
import { useNavigation } from '..';
import Login from '../../screen/Auth/Login/Login';
import Register from '../../screen/Auth/Register/Register';
import { leftToRightStackAnimation } from '../util';
import {useEffect} from "react"
//  In the SHOP 

export type AuthStackList = {
  login : undefined 
  register : undefined 
}

const AuthStackNavigator = createStackNavigator<AuthStackList>();
function AuthStack() {
  const {user} = useAuth();
  const {navigation,route} = useNavigation();
  const redirect = ()=>{
    if(user) {
      if(user.role!="DRIVER")
        navigation.navigate("User");  
      else 
        navigation.navigate("Driver"); 
    }
  }

  useEffect(()=>{
    if(user){
      redirect()
    }
  },[user?.id])
  if(user){
    return null ; 
  }
  return (
  
    <AuthStackNavigator.Navigator
      screenOptions={{headerShown:false}}
    >
      <AuthStackNavigator.Screen name="login" component={Login} options={{...leftToRightStackAnimation}}  />
      <AuthStackNavigator.Screen name="register" component={Register} options={{...leftToRightStackAnimation}} />
    </AuthStackNavigator.Navigator>
  );
}
export default AuthStack