import { StackNavigationProp } from "@react-navigation/stack";
import { NavigatorList } from "./main";
import { useNavigation as useNativeNavigation, useRoute , RouteProp, CompositeNavigationProp, NavigationContainerRef} from '@react-navigation/native';
import React from "react";



type GlobalStackParamList <T extends keyof NavigatorList> = 
    StackNavigationProp<NavigatorList,T>

export const useNavigation =<T extends keyof NavigatorList>()=>{
    const navigation =  useNativeNavigation<GlobalStackParamList<T>>();
    const route = useRoute<RouteProp<NavigatorList,T>>()
    return {navigation,route}
}
export const navigationRef = React.createRef<NavigationContainerRef<NavigatorList>>()
