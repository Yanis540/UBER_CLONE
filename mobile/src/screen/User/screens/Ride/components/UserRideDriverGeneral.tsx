import React, { useMemo } from 'react';
import { Text, View , Image, TouchableOpacity } from 'react-native'
import { uberFont } from '../../../../../styles';
import { useAuth, useRideStore } from '../../../../../context/store';
import RatingComponent from '../../../../../components/Rating/RatingComponent';
import { useNavigation } from '../../../../../routes';
import { useDriverRating } from '../../../../../hooks';
interface UserRideDriverGeneralProps {
};

function UserRideDriverGeneral({}:UserRideDriverGeneralProps) {
    const {ride,set_ride} = useRideStore();
    const {navigation} = useNavigation(); 
    const update_rating = (driver:Driver)=>{
        // open a modal for that for the rating thing or redirect to comments 
        if(!ride)
            return ; 
        set_ride({...ride,driver }) 
             
    }
    const {rate} = useDriverRating(ride?.driver?.licence_id??"",update_rating); 
    const {user} = useAuth();
    const user_rating_on_driver = useMemo(()=>
        user?.ratings.filter((rating)=>rating.licence_id== ride?.driver?.licence_id),
        [user?.ratings?.length]
    ); 


    const navigateToDriverProfile= ()=>{
        if(!ride || !ride.driver_licence_id || !ride.driver)
            return ; 
        navigation.navigate("User",{
            screen:"home_stack",
            params:{
                screen:"driver",
                params:{
                    id:ride?.driver?.licence_id
                }
            }
        })
    }
    if(ride?.driver==undefined || ride.driver==null)
        return null 
    return (
    <View className="flex flex-col border-b-[1px] border-b-gray-200 px-3 mt-2 py-2  ">
        <TouchableOpacity onPress={navigateToDriverProfile} disabled={!ride || !ride.driver}>
            <View className="flex flex-row items-center justify-between ">
                {/* Image */}
                <View className="flex flex-row items-center ">
                    <View className="w-[32px] h-[32px] ">
                        <Image source={{uri:ride?.driver?.user?.photo!}} className="h-full w-full rounded-full" />
                    </View>
                    <View className="flex flex-col items-start" >
                        <Text style={uberFont} className="font-semibold ml-2 mb-2">{ride?.driver?.user?.name} </Text>
                        <Text style={uberFont} className="font-semibold ml-2 mb-2 text-gray-500">{ride?.driver?.user?.phone_number} </Text>
                    </View>
                </View>
                <RatingComponent 
                    driver={ride.driver}  
                    rating={user_rating_on_driver?.[0]?.rating??0} 
                    rate={rate} 
                /> 
            </View>
        </TouchableOpacity>
        <View className="flex flex-row  items-center justify-between mt-2 ">
            <View className="flex flex-row  items-start" >
                <Text style={uberFont} className="font-semibold text-gray-500">Licence ID:</Text>
                <Text style={uberFont} className="font-semibold ml-1 ">{ride?.driver?.licence_id}</Text>
            </View>
            <View className="flex flex-row  items-end py-2" >
                <Text style={uberFont} className="font-semibold text-gray-500">Car Model :</Text>
                <Text style={uberFont} className="font-semibold ml-1 capitalize ">{ride?.car?.car_model}</Text>
            </View>
           
        </View>
        <View className="flex flex-row items-center justify-between ">
            <View className="flex flex-row  items-start py-2" >
                <Text style={uberFont} className="font-semibold text-gray-500">Car Type :</Text>
                <Text style={uberFont} className="font-semibold ml-1 capitalize ">{ride?.car?.car_type}</Text>
            </View>
            <View className="flex flex-row  items-end py-2" >
                <Text style={uberFont} className="font-semibold text-gray-500">Car id :</Text>
                <Text style={uberFont} className="font-semibold ml-1 ">{ride?.car?.car_id} </Text>
            </View>
        </View>
    </View>
    );
};

export default UserRideDriverGeneral;