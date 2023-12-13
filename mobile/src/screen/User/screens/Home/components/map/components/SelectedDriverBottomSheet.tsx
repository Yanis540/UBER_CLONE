import React, { useMemo } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import BottomSheetModal from '../../../../../../../components/BottomSheet/BottomSheetModal';
import {BottomSheetModal as GorhomBottomSheetModal,} from '@gorhom/bottom-sheet';
import { useNavigation } from '../../../../../../../routes';
import { useDriver } from '../../../../Driver/hooks/use-driver';
import ErrorComponent from '../../../../../../../components/Error/ErrorComponent';
import { default_user_img, uberFont } from '../../../../../../../styles';

interface SelectedDriverBottomSheetProps {
    bottomSheetModalRef ?: React.RefObject<GorhomBottomSheetModal>
    driverIdRef ? : React.RefObject<string|undefined>
};

function SelectedDriverBottomSheet({bottomSheetModalRef,driverIdRef}:SelectedDriverBottomSheetProps) {
    const snapPoints = useMemo(()=>["35%"],[]);
    return (
    <BottomSheetModal 
        canClose={true} snapPoints={snapPoints} 
        ref_sheet={bottomSheetModalRef} 
    >
        <Content driverIdRef={driverIdRef} />        
    </BottomSheetModal>
    );
};

function Content({driverIdRef}:{driverIdRef?:React.RefObject<string|undefined>}){
    const {navigation} = useNavigation()
    const {data,isLoading,error,refreshing,onRefresh} = useDriver(driverIdRef?.current??"")
    const navigateToRide = ()=>{
        navigation?.navigate("User",{
            screen:"home_stack",
            params:{
                screen:"driver",
                params:{
                    id:driverIdRef?.current??""
                }
            
            }
        })
    } 
    if(isLoading)return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="black" /> 
        </View>
    )
    if(error|| !isLoading && !data.driver) return (
        <View className="flex-1 flex bg-white">
            <ErrorComponent data={data} error={error} /> 
        </View>
    )
    return (
    <TouchableOpacity className="flex-1" onPress={navigateToRide}>
        <ScrollView className="flex-1 "  contentContainerStyle={{ flexGrow: 1}} >
            <View className="flex flex-col ">
                <View className="flex flex-col items-center justify-center">
                    <View className=" h-[64px] w-[64px] p-2 rounded-full    ">
                        <Image source={{uri: data?.driver?.user?.photo!??default_user_img}} className="w-full h-full rounded-full" /> 
                    </View>
                </View>
            </View>
            <View className="flex flex-col">
                <View className="flex flex-col items-center justify-center">
                    <Text style={uberFont} className="font-bold text-xl">{data?.driver?.user?.name}</Text>
                </View>
                <View className="flex flex-col items-center justify-between " >
                    <View className="flex flex-col">
                        <View className="flex flex-row items-center py-2" >
                            <Text style={uberFont} className="font-semibold text-gray-500">Phone :</Text>
                            <Text style={uberFont} className="font-semibold ml-1 text-[13px] ">{data?.driver?.user?.phone_number} </Text>
                        </View>
                        <View className="flex flex-row items-center py-2" >
                            <Text style={uberFont} className="font-semibold text-gray-500">Licence ID :</Text>
                            <Text style={uberFont} className="font-semibold ml-1 text-[13px] ">{data?.driver?.licence_id} </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    </TouchableOpacity>
    )
} 
export default SelectedDriverBottomSheet;