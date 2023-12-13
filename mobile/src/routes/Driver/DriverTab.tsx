import React from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign , Entypo , MaterialCommunityIcons } from '@expo/vector-icons';
import DriverHomeStack, { DriverHomeStackList } from './Stacks/DriverHomeStack';
import ProfileStack, { ProfileStackList } from '../Common/Profile/ProfileStack';
export type DriverTabList ={
    home_stack  ?: NavigatorScreenParams<DriverHomeStackList>
    profile_stack  ?: NavigatorScreenParams<ProfileStackList>
}




const Tab = createBottomTabNavigator<DriverTabList>();


function DriverTab(){
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
            headerShown:false,
            tabBarStyle:{
                backgroundColor:"black", 
                borderColor:"white", 
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'rgb(107 114 128)',
            tabBarShowLabel:false
            // tabBarLabel: route.name.split("_")[1].split("_")[0].toUpperCase().charAt(0)+ route.name.split("_")[1].split("_")[0].slice(1)
          })}
    >
        <Tab.Screen name="home_stack" component={DriverHomeStack} options={{headerShown:false}} />
        <Tab.Screen name="profile_stack" component={ProfileStack} options={{headerShown:false}} />
    </Tab.Navigator>
    )
}

export default DriverTab;