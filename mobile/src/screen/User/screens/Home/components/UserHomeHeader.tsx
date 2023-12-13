import React from 'react';
import { Text, View , TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import { useAuth } from '../../../../../context/store';
import { useNavigation } from '../../../../../routes';
import { uberFont } from '../../../../../styles';

interface UserHomeHeaderProps {

};

function UserHomeHeader({}:UserHomeHeaderProps) {
    const {user} = useAuth(); 
    const {navigation} = useNavigation();
    const activeRides = user?.rides?.filter((ride)=>ride.ride_status=="progress");
    const currentRide = (activeRides && activeRides.length) ? activeRides[0] : undefined
    const navigateToRide = (id:string)=>{
        navigation.navigate("User",{
            screen:"home_stack",
            params:{
                screen:"ride",
                params:{id:id}
            }
        })
    }
    const navigateToAddRide = ()=>navigation.navigate("User",{screen:"home_stack",params:{screen:"add_ride"}})
    return (
    <View className="flex flex-col  ">
        <View className="flex flex-row items-center justify-start relative px-4 py-4 bg-black  rounded-lg  ">
            {/* Header */}
            <View>
                <Text style={uberFont} className="text-white text-lg mb-2" >Welcome back {user?.name}  </Text>
                <Text style={uberFont} className="text-gray-300 text-md text-end" >
                { currentRide
                    ? 
                    <TouchableWithoutFeedback onPress={()=>navigateToRide(currentRide.id)}>
                        <View className="flex flex-row items-center ">
                            <Text style={uberFont} className={`text-gray-300 text-[12px]`}>Current : {currentRide?.start_address?.name} to {currentRide?.destination_address?.name}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    : 
                    <TouchableWithoutFeedback onPress={()=>navigateToAddRide()}>
                        <View className="flex flex-row items-center ">
                            <Text style={uberFont} className={`text-gray-300 text-[12px]`}>Take a ride ?</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }  
                </Text>
            </View>
            
        </View>
    </View>
    );
};

export default UserHomeHeader;