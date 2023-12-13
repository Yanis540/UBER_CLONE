import {useState} from 'react';
import { Text, View , TouchableWithoutFeedback, } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '../../../../../routes';
import { uberFont } from '../../../../../styles';
interface UserHomeNavigationProps {

};

function UserHomeNavigation({}:UserHomeNavigationProps) {
    const [isDown,setIsDown] = useState<boolean>(false); 
    const {navigation} = useNavigation()
    const navigateToRides = ()=>navigation.navigate("User",{screen:"home_stack",params:{screen:"rides"}}); 
    const navigateToAddRide = ()=>navigation.navigate("User",{screen:"home_stack",params:{screen:"add_ride"}})
    const informations :  {key:string,text:string,Icon:any,onPress:()=>void}[] = [
        {key:"1",text:"Start a new ride",Icon:()=><FontAwesome name="map-marker" size={20} color="black" />,onPress:navigateToAddRide},
        {key:"2",text:"Review Rides",Icon:()=><FontAwesome name="history" size={18} color="black" />,onPress:navigateToRides},
    ]
   
    return (
        <View className="flex flex-col my-5 z-[100]  " >
            <View className="flex flex-row items-center  bg-gray-200  rounded p-4 mb-5" >
                <Text  style={uberFont} className="flex-1 font-bold border-r border-r-gray-300">Where to go ?</Text>
                <View className="flex flex-row justify-center bg-white  ml-2  p-2 rounded-lg">
                    <View className="flex flex-row justify-center">
                        <AntDesign name="clockcircle" size={18} color="black"  />
                        <Text style={uberFont} className="text-black ml-1 ">Now</Text>
                    </View>
                    <View className="ml-2">
                        <TouchableWithoutFeedback onPress={()=>setIsDown(!isDown)}>
                            <AntDesign name={!isDown?"down":"up"} size={18} color="black" />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
            
            <View className="flex flex-col">
                {informations.map((item)=>(
                <View key={item.key} className="flex flex-col " >
                    <View className="flex flex-row items-center border-b-[1px] border-b-gray-200 py-3">
                        <View className="p-2 bg-gray-200 rounded-full mr-4">
                            <item.Icon />
                        </View>
                        <View className='flex-1 '>
                            <TouchableOpacity className="flex-1 flex-row items-center justify-between" onPress={item.onPress}>
                                <Text style={uberFont} className="font-semibold">{item.text}</Text>
                                <AntDesign name="right" size={18} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                ))}
            </View>
        </View>
    );
};

export default UserHomeNavigation;