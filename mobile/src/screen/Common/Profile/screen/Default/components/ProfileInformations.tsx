import React from 'react';
import { Text, View , Image, ActivityIndicator, Modal } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../../../../../../context/store';
import { default_user_img, statusBarMargin, uberFont } from '../../../../../../styles';
import moment from 'moment';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUpdatePaymentMethod } from '../hooks/use-update-payment-method';
import { Avatar } from '../../../../../../components/Avatar';
interface ProfileInformationsProps {
    onLongPress: ()=>void
};

function ProfileInformations({onLongPress}:ProfileInformationsProps) {
    const {user} = useAuth()
    const {update:update_payment_method,isLoading:isUpdatingPaymentMethod} = useUpdatePaymentMethod(); 
    const number_units_time = user && moment(user.created_at).fromNow().split(" ")[0] 
    const unit_time = user && moment(user.created_at).fromNow().split(" ")[1].split(" ")[0] 

    return (
    <View className="flex flex-col  items-center py-2 px-3   ">
        <Avatar src={user?.photo} onLongPress={onLongPress} /> 
        <View className="flex items-center my-2 ">
            <Text style={uberFont} className="pb-1 text-[17px]">{user?.name}</Text>
            <Text style={uberFont} className="pb-1 text-[14px] text-gray-500">{user?.email}</Text>
            <Text style={uberFont} className="pb-1 text-[14px] text-gray-500">{user?.address??"No address"}</Text>
            <Text style={uberFont} className="pb-1 text-[14px] text-gray-500">{user?.phone_number}</Text>
        </View>
        <View className="flex flex-row items-center justify-around w-full px-2  "> 
            <View className='flex flex-col items-center'>
                <Text style={uberFont} className="font-semibold text-[21px] py-1">{user?._count?.rides} </Text>
                <Text style={uberFont} className="font-semibold text-[13px] text-gray-500">Trip</Text>
            </View>
            <View className='flex flex-col items-center'>
                <Text style={uberFont} className="font-semibold text-[21px] py-1">{number_units_time}</Text>
                <Text style={uberFont} className="font-semibold text-[13px] text-gray-500">{unit_time}</Text>
            </View>
        </View>
        <View className="flex flex-row items-center justify-center w-full px-2  py-2 "> 
            <View className="flex flex-col py-1 px-3 bg-green-200  rounded-lg   items-baseline ">
                <TouchableOpacity onPress={()=>{update_payment_method()}} disabled={isUpdatingPaymentMethod}>
                    {
                        isUpdatingPaymentMethod
                            ?   <ActivityIndicator color="rgb(34 197 94)" />  
                            :   <FontAwesome5 name={user!?.prefered_payment_type=="cash"?"coins":"credit-card"} size={15} color="rgb(34 197 94)" />
                    }
                    
                </TouchableOpacity>
            </View>
        </View>
    
    </View>
    );
};

export default ProfileInformations;