import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import AuthStack,{ AuthStackList } from './Auth/AuthStack';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigatorScreenParams, } from '@react-navigation/native';
import { useAuth } from '../context/store';
import UserTab, { UserTabList } from './User/UserTab';
import {leftToRightStackAnimation} from "./util" 
import DriverTab, { DriverTabList } from './Driver/DriverTab';
import { usePushNotificationToken } from '../hooks/notifications/use-push-notifications';
import { navigationRef } from '.';
import { useSockets } from '../hooks/sockets';
export type NavigatorList ={
    Auth ?: NavigatorScreenParams<AuthStackList>
    User ?: NavigatorScreenParams<UserTabList>
    Driver ?: NavigatorScreenParams<DriverTabList>
}
const Stack = createStackNavigator<NavigatorList>(); 


function Navigator() {
    const {user} = useAuth(); 
    useSockets(); 
    usePushNotificationToken();

    return (
    <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
            {/* <Stack.Screen name="Content" component={TabNavigator} options={{headerShown:false}} /> */}
            <Stack.Screen name="Auth" component={AuthStack} options={{...leftToRightStackAnimation,headerShown:false}} />
            <Stack.Screen name="User" component={UserTab} options={{...leftToRightStackAnimation,headerShown:false}} />
            <Stack.Screen name="Driver" component={DriverTab} options={{headerShown:false}} />
        </Stack.Navigator>
    </NavigationContainer>
    );
};


export default Navigator;