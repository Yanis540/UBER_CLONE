import React from 'react';
import { Text, View,ScrollView ,TouchableOpacity} from 'react-native'
import { uberFont } from '../../styles';
import { AntDesign } from '@expo/vector-icons';

interface RoutesProps {
    routes: RouteCategorie[]
};

function Routes({routes}:RoutesProps) {
    return (
    <ScrollView className="">
    {
        routes.map((route)=>(
            <View key={route.name} className="flex flex-col px-5 py-3">
                <View className="flex flex-row items-center  border-b-[1px] border-gray-200 py-2 ">
                    {route.Icon&& (
                        <route.Icon /> 
                    )}
                    <Text style={uberFont} className="ml-2 text-[21px] capitalize" >{route.name}</Text>
                </View>
                {
                    route.screens.map((screen)=>(
                    <TouchableOpacity key={screen.name} onPress={screen.navigate} >
                        <View className="flex flex-row items-center  py-5  ">
                            <View className='ml-5'> 
                                <Text style={uberFont} className="" >{screen.name}</Text>
                            </View>
                            <View className="flex-1 flex flex-row items-center justify-end">
                                <AntDesign name="right" size={18} color="black" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    ))
                }
            </View>
        ))
    }
    </ScrollView>
    );
};

export default Routes;