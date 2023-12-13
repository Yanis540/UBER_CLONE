import {useEffect} from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useRideCosts } from './hooks/use-ride-costs';
import { RefreshControl } from 'react-native-gesture-handler';
import ErrorComponent from '../../../../../../components/Error/ErrorComponent';
import { uberFont } from '../../../../../../styles';
import { useAddRideStore } from '../../context/use-add-ride-store';
import { calculate_total_ride } from '../util';
import { Feather } from '@expo/vector-icons';
import { useAddRideNavigation } from '../../routes';
import { useAuth } from '../../../../../../context/store';
interface AddRideCarTypeProps {

};

function AddRideCarType({}:AddRideCarTypeProps) {
    const {data,isLoading,error,refreshing,onRefresh} = useRideCosts();
    const {costs} = data ; 
    const {user} = useAuth()
    const {informations,set_payment_type,payment_type,set_car_type}  = useAddRideStore();
    const {navigation} = useAddRideNavigation();
    useEffect(()=>{
        if(!payment_type)
            set_payment_type(user!?.prefered_payment_type)
    },[payment_type])


    if(!informations )
        return null ; 

    if(error||  (!isLoading && !refreshing && !data?.costs))return(
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
    // <RefreshControl className="flex-1 bg-white px-5  " refreshing={refreshing} onRefresh={onRefresh}  >
        <View className="flex-1 flex flex-col bg-white  py-2  ">
           {
            costs && (
                <FlatList 
                    data = {costs.car_types}
                    keyExtractor={(car_type)=>car_type.type}
                    refreshControl={<RefreshControl className="" refreshing={refreshing} onRefresh={onRefresh}  />}
                    refreshing={refreshing}
                    renderItem={({item})=>{
                        const total_price_in_usd = calculate_total_ride({
                            distance:informations.distance,
                            price_per_km:item.price_per_km,
                            additionnal:costs.ADDITIONAL_FEE,
                            traffic_coef:costs.TRAFIC_COEF
                        })
                        const navigateToPaymentDetails = ()=>{
                            set_car_type(item.type)
                            navigation.navigate(
                                "payment_details",{
                                    price_per_km:item.price_per_km,
                                    additionnal:costs.ADDITIONAL_FEE , 
                                    traffic_coef: costs.TRAFIC_COEF, 
                                    car_type: item.type
                                }
                            )
                        }
                        const currency ="usd"
                        return (
                        <TouchableOpacity onPress={navigateToPaymentDetails}>
                            <SafeAreaView className="flex flex-row items-center justify-between  border-b-[1px] border-gray-100 rounded py-3 px-2" >
                                    <View className="flex flex-row items-center ">
                                        <View  className="w-[80px] h-[80px] ">
                                            <Image source={{uri:item?.photo!}} className="h-full w-full rounded-lg aspect-square " />
                                        </View>
                                        <View className="flex flex-col justify-between ml-5  ">
                                            <View>
                                                <Text style={uberFont} className="font-bold" >{new Intl.NumberFormat("fr-FR",{style:"currency",currency:currency}).format(total_price_in_usd)}</Text>
                                            </View>
                                            <View>
                                                <Text style={uberFont} className="capitalize text-[15px] " >{item.type}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <Feather name="chevron-right" size={24} color="black" />
                                    </View>
                            </SafeAreaView>
                        </TouchableOpacity>
                        )
                    }
                    }
                />
            )
           }
        </View>
    // </RefreshControl>
    );
};

export default AddRideCarType;