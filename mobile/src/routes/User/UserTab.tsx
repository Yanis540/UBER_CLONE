import React from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign , Entypo , MaterialCommunityIcons } from '@expo/vector-icons';
import UserHomeStack,{ UserHomeStackList } from './Stacks/UserHomeStack';
import {Text, View} from "react-native"
import ProfileStack, { ProfileStackList } from '../Common/Profile/ProfileStack';
import { useAuth } from '../../context/store';
import { useNavigation } from '..';
export type UserTabList ={
    home_stack  ?: NavigatorScreenParams<UserHomeStackList>
    profile_stack  ?: NavigatorScreenParams<ProfileStackList>
}




const Tab = createBottomTabNavigator<UserTabList>();


function UserTab(){
    const {user} = useAuth();
    const {navigation,route} = useNavigation()
    if(!user){
        navigation.navigate("Auth")
    }
    return (
    <Tab.Navigator
                
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                switch(route.name){
                    case "home_stack":{
                        return <AntDesign name="home" size={32} color={color} />  
                    }
                    // //account
                    case "profile_stack":{
                        return <MaterialCommunityIcons name="account" size={32} color={color} />  
                    }
                }
            },
            tabBarStyle:{
                backgroundColor:"black", 
                borderColor:"white", 
            },
            headerShown:false,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'rgb(107 114 128)',
            tabBarShowLabel:false
            // tabBarLabel: route.name.split("_")[1].split("_")[0].toUpperCase().charAt(0)+ route.name.split("_")[1].split("_")[0].slice(1)
          })}
    >
        <Tab.Screen name="home_stack" component={UserHomeStack} options={{headerShown:false,}} />
        <Tab.Screen name="profile_stack" component={ProfileStack} options={{headerShown:false}} />
    </Tab.Navigator>
    )
}

export default UserTab;