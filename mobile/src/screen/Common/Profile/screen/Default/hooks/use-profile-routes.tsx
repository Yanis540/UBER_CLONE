import { useNavigation } from "../../../../../../routes"
import { MaterialCommunityIcons   } from '@expo/vector-icons';


export const useProfileRoutes = ()=>{
    const {navigation} = useNavigation();
    const navigate = (screen:string)=>navigation.navigate("User",{screen:"profile_stack",params:{screen:screen as any}})

    const account_screens:Screen[] = [
        { name:"Edit Profile", navigate : ()=>navigate("profile_details"),}, 
        { name:"Change Password", navigate : ()=>navigate("profile_password"),}, 
    ]
    const categories:RouteCategorie[] = [
        {
            name:"Account",
            screens:account_screens,
            Icon : ()=><MaterialCommunityIcons name="account-cog-outline" size={24} color="black" />,
        }
    ]

    return categories 

}