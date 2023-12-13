import { StackNavigationProp } from "@react-navigation/stack";
import { AddRideStackList } from "./Stack/AddRideStack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

type GlobalStackParamList <T extends keyof AddRideStackList> = 
    StackNavigationProp<AddRideStackList,T>

export const useAddRideNavigation =<T extends keyof AddRideStackList>()=>{
    const navigation =  useNavigation<GlobalStackParamList<T>>();
    const route = useRoute<RouteProp<AddRideStackList,T>>()
    return {navigation,route}
}