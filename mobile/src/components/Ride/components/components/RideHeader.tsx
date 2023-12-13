
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import { AntDesign } from '@expo/vector-icons';
import HeaderStack from '../../../Header/Stack/HeaderStack';
import { Text, View } from 'react-native';
import { uberFont } from '../../../../styles';
import { rideInformations } from '../../../../util/ride';
import { useRideStatus } from '../../../../hooks/rides';
import { useRideStore } from '../../../../context/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface UserRideHeaderProps {
};
 
function RideHeader({}:UserRideHeaderProps) {
    const {ride,isLoading} = useRideStore()
 
    const {cancel,refund} = useRideStatus(ride?.id)
    const handleCancelRide =(message?:string)=>{
        // pass it a message 
        if(isLoading)
            return ; 
        cancel.cancel(message)
    }
    const {cancellable,refundable} = rideInformations(ride); 
    const handleRefundRide = ()=>{
        if(isLoading)
            return ; 
        refund.refund({})
    }
    const handleContactSupport= ()=>{

    }
    return (
    <HeaderStack label="Ride"  >
        <Menu>
            <MenuTrigger >
                <Entypo name="dots-three-vertical" size={20} color="black" />
            </MenuTrigger>
            
            <MenuOptions customStyles={{optionText:{fontFamily:"uber",color:"white"},optionsWrapper:{backgroundColor:"black",borderRadius:2,padding:5}}}>
                {
                    cancellable&& (
                    <MenuOption onSelect={handleCancelRide}  style={{paddingVertical:10,borderBottomColor:"rgb(156 163 175)",borderBottomWidth:1}}>
                        <View className="flex flex-row items-center">
                            <MaterialIcons name="cancel" size={18} color="rgb(239 68 68)" />
                            <Text  style={uberFont} className="ml-2 text-red-500 text-[12px]">Cancel ride</Text>
                        </View>
                    </MenuOption>
                    )
                }
                {
                    refundable && (
                    <MenuOption onSelect={handleRefundRide}  style={{paddingVertical:10,borderBottomColor:"rgb(156 163 175)",borderBottomWidth:1}}>
                        <View className="flex flex-row items-center ">
                            <MaterialCommunityIcons name="cash-refund" size={18} color="rgb(74 222 128)" />
                            <Text  style={uberFont} className="ml-2 text-green-400 text-[12px]">Refund</Text>
                        </View>
                    </MenuOption>
                    )
                }
                <MenuOption onSelect={handleContactSupport} style={{paddingVertical:10}}  >
                    <View className="flex flex-row items-center">
                        <AntDesign name="customerservice" size={18} color="white" />
                        <Text  style={uberFont} className="ml-2 text-white text-[12px] ">Contact Support</Text>
                    </View>
                </MenuOption>
            
            </MenuOptions>
        </Menu>
    </HeaderStack>
    );
};
export default RideHeader; 