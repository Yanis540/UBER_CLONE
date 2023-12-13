import { useNavigation } from "../../../../../routes";




export const useDriverRoutes = ()=>{
    const {navigation} = useNavigation();
    const navigate = (screen:string)=>navigation.navigate("Driver",{screen:"home_stack",params:{screen:screen as any}})

    const rides_screens:Screen[] = [
        { name:"Previous Rides", navigate : ()=>navigate("rides"),}, 
        { name:"Nearby Rides", navigate : ()=>navigate("rides_nearby"),}, 
    ]
    const cars:Screen[] = [
        { name:"Choose cars", navigate : ()=>navigate("cars"),}, 
    ]
    const categories:RouteCategorie[] = [
        {
            name:"Rides",
            screens:rides_screens,
            Icon : null 
        }, 
        {
            name:"Cars",
            screens:cars,
            Icon : null 
        }, 
    ]

    return categories; 


}

