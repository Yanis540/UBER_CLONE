import React, { useState } from 'react';
import { View  , RefreshControl, ActivityIndicator , FlatList, TouchableOpacity, Modal, Text } from 'react-native'
import { useRides } from './hooks/use-rides';
import { statusBarMargin, uberFont } from '../../../../styles';
import ErrorComponent from '../../../../components/Error/ErrorComponent';
import HeaderStack from '../../../../components/Header/Stack/HeaderStack';
import { RideComponent } from '../../../../components/Ride';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
interface UserRidesProps {

};
enum RideStatus {
    proposed= "proposed",
    accepted= "accepted",
    progress= "progress",
    cancelled= "cancelled",
    finished= "finished",
}
type SelectType ={
    key: RideStatus;
    value: RideStatus;
}
const rideStatus: SelectType[] = Object.values(RideStatus).map((status)=>({key:status,value:status}))
function UserRides({}:UserRidesProps) {
    const [selected,setSelected] = useState<RideStatus[]>([]); 
    const [isModalVisible,setIsModalVisible] = useState<boolean>(false);  
    const {data,isLoading,error,refreshing,onRefresh,refresh} = useRides(); 
    const closeModal = ()=>setIsModalVisible(false);  
    const openModal = ()=>setIsModalVisible(true);
    const handleFilter = ()=>{
        refresh({ride_status:selected}); 
        setSelected([]); 
        closeModal()
    }  
    
   
    if(error)return(
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
    <View className='flex-1 flex bg-white'  style={statusBarMargin}>
        <HeaderStack label="rides">
            <TouchableOpacity onPress={openModal}>
                <Ionicons name="options-outline" size={24} color="black" />
            </TouchableOpacity>
        </HeaderStack> 
        
        <FlatList 
            data={data.rides}
            keyExtractor={(item)=>item.id}
            className="flex-1 h-full px-3 mb-5 "
            refreshControl={ <RefreshControl className="flex-1 bg-white  border " refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({item:ride})=><RideComponent stack="User" ride={ride} />}
        />
        <Modal visible={isModalVisible} animationType="slide"> 
            <View className="flex-1 flex-col px-3 py-4 ">
                <View className="flex flex-row items-center justify-end">
                    <TouchableOpacity onPress={closeModal}>
                        <AntDesign name="closecircleo" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View className='flex-1 mt-5'>
                    <MultipleSelectList 
                        setSelected={(val:RideStatus[]) => setSelected(val)} 
                        data={rideStatus}
                        save="value"
                        label="Ride Status"
                    />
                    <View className="flex-1 flex justify-end ">
                        <View className=" flex flex-col items-center justify-center px-5 py-2 rounded-lg    bg-black">
                            <TouchableOpacity onPress={handleFilter}>
                                <Text style={uberFont} className='text-white text-lg font-bold'>Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    </View>
    );
};

export default UserRides;
