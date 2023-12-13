import { createStackNavigator } from '@react-navigation/stack';
import { leftToRightStackAnimation } from '../../../../../../routes/util';
import AddRidePaymentDetails from '../../screen/Payment/AddRidePaymentDetails';
import { useAddRideStore } from '../../context/use-add-ride-store';
import AddRideCarType from '../../screen/Type/AddRideCarType';
import { View } from 'react-native';


export type AddRideStackList ={
    ride_car_type : undefined 
    payment_details : {
        car_type : CarType
        price_per_km : number 
        additionnal : number 
        traffic_coef : number 
    } 

}


const AddRideStackNavigator = createStackNavigator<AddRideStackList>();
function AddRideStack() {
    const {origin,destination,informations} = useAddRideStore()
    if(!origin || !destination || !informations)
        return null ;
    return (
    <View className="flex-[0.7]">

        <AddRideStackNavigator.Navigator
            screenOptions={()=>{
            return {
                animationEnabled:true,
                headerLeft: ()=> null,
                headerShown:false
                // headerTitle:null
            }
            }}
        >
            <AddRideStackNavigator.Screen name="ride_car_type" component={AddRideCarType} options={{...leftToRightStackAnimation,headerShown:false}} />
            <AddRideStackNavigator.Screen name="payment_details" component={AddRidePaymentDetails} options={{...leftToRightStackAnimation,headerShown:false}} />
        </AddRideStackNavigator.Navigator>
    </View>
    );
}


export default AddRideStack

    
