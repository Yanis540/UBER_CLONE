import React, { useMemo } from 'react';
import { ActivityIndicator, RefreshControl, Text, View,ScrollView, Image, TouchableOpacity } from 'react-native'
import {BottomSheetModal as GorhomBottomSheetModal,} from '@gorhom/bottom-sheet';
import BottomSheetModal from '../../../../../components/BottomSheet/BottomSheetModal';
import { useRide } from '../../../../../hooks/rides';
import ErrorComponent from '../../../../../components/Error/ErrorComponent';
import { default_user_img } from '../../../../../styles';
import { RideGeneralInformations, RidePaymentInformations, RideTimingInformations } from '../../../../../components/Ride';
import { useNavigation } from '../../../../../routes';
interface SelectedRideNearbyInformationsProps {
    bottomSheetModalRef ?: React.RefObject<GorhomBottomSheetModal>
    rideIdRef ? : React.RefObject<string|undefined>
};

function SelectedRideNearbyInformations({bottomSheetModalRef,rideIdRef}:SelectedRideNearbyInformationsProps) {
    const snapPoints = useMemo(()=>['50%'],[]);
    return (
    <BottomSheetModal 
        canClose={true} snapPoints={snapPoints} 
        ref_sheet={bottomSheetModalRef} 
    >
        <Content rideIdRef={rideIdRef} />        
    </BottomSheetModal>
    );
};
function Content({rideIdRef}:{rideIdRef?:React.RefObject<string|undefined>}){
    const {navigation} = useNavigation()
    const {data,isLoading,error,refreshing,onRefresh} = useRide(rideIdRef?.current??"")
    const navigateToRide = ()=>{
        navigation?.navigate("Driver",{
            screen:"home_stack",
            params:{
                screen:"ride",
                params:{
                    id:rideIdRef?.current??""
                }
            }
        })
    } 
    if(isLoading)return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="black" /> 
        </View>
    )
    if(error|| !isLoading && !data.ride) return (
        <View className="flex-1 flex bg-white">
            <ErrorComponent data={data} error={error} /> 
        </View>
    )
    return (
    <TouchableOpacity className="flex-1" onPress={navigateToRide}>
        <ScrollView className="flex-1 "  contentContainerStyle={{ flexGrow: 1}} >
            {/* Image */}
            <View className="flex flex-col items-center justify-center">
                <View className=" h-[64px] w-[64px] p-2 rounded-full    ">
                    <Image source={{uri: data?.ride?.user?.photo!??default_user_img}} className="w-full h-full rounded-full" /> 
                </View>
            </View>
            <View className="flex flex-col items-center justify-center">
                <Text className="font-bold text-xl">{data?.ride?.user?.name}</Text>
            </View>
            
            <View className="border-b-[1px] border-gray-200">
                <View className=" flex flex-col px-3 mt-2 pb-2  ">
                    <RideGeneralInformations /> 
                    <RidePaymentInformations /> 
                    <RideTimingInformations /> 
                </View>
            
            </View>
            
        </ScrollView>
    </TouchableOpacity>
    )
} 

export default SelectedRideNearbyInformations;