import React, { useCallback, useMemo, useRef } from 'react';
import { View , RefreshControl, ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { useNavigation } from '../../../../routes';
import { useDriver } from './hooks/use-driver';
import { useDriverStore } from '../../../../context/store';
import ErrorComponent from '../../../../components/Error/ErrorComponent';
import { statusBarMargin, } from '../../../../styles';
import DriverProfileGeneral from './components/DriverProfileGeneral';
import MapMarkers from '../../../../components/Map/MapMarkers';
import Comments from '../../../../components/Comments/Comments';
import {BottomSheetModal as GorhomBottomSheetModal,} from '@gorhom/bottom-sheet';
import BottomSheetModal from '../../../../components/BottomSheet/BottomSheetModal';
import HeaderStack from '../../../../components/Header/Stack/HeaderStack';

interface DriverProfileProps {

};

function DriverProfile({}:DriverProfileProps) {
    const {route} = useNavigation(); 
    const id = (route.params as unknown as  {id:string})?.id!
    const {data,isLoading,error,refreshing,onRefresh} = useDriver(id); 
    const {driver} = useDriverStore(); 
    const bottomSheetModalRef = useRef<GorhomBottomSheetModal>(null);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);


    if(error|| (!isLoading && !refreshing && !driver))return(
        <RefreshControl className="flex-1 bg-white px-5 py-2 " refreshing={refreshing} onRefresh={onRefresh}  >
            <View className='flex-1' >
                <ErrorComponent data={data} error={error} /> 
            </View>
        </RefreshControl>
    )
    if(isLoading &&!refreshing) return (
        <View className="flex-1 flex flex-col items-center justify-center bg-white ">
            <ActivityIndicator color="black" />
        </View>
    )
    return (
    <RefreshControl className="flex-1 bg-white " refreshing={refreshing} onRefresh={onRefresh}  style={statusBarMargin}>
        <SafeAreaView className="flex-1 flex flex-col bg-white  py-2 ">
            <HeaderStack label="Driver"  /> 
            <ScrollView className=""> 
                <DriverProfileGeneral onLongPress={handlePresentModalPress} /> 
                <View className="h-[200px]">
                {
                    driver?.isAvailable == true && driver.user.localisation!=undefined &&driver.user.localisation!=null   &&(
                        <MapMarkers markers={[{
                            localisation:driver.user.localisation!,
                            title:driver.user.email,
                            name:driver.user.name, 
                        }]} />
                    )
                }
                </View>
            </ScrollView>
            <BottomSheetModal canClose={true} ref_sheet={bottomSheetModalRef} snapPoints={["50%","100%"]} >
                <View className="flex-1">
                    <Comments driverId={driver?.licence_id!}/> 
                </View>    
            </BottomSheetModal> 
           
        </SafeAreaView>
    </RefreshControl>
    );
};

export default DriverProfile;