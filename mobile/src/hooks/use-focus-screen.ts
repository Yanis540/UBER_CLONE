import { useEffect } from "react"
import { useNavigation } from "../routes"

export const useFocusScreen = (refresh : (data?:any|undefined)=>void |any ,data?:any|undefined)=>{
    const {navigation} = useNavigation()
    useEffect(()=>{
        navigation.addListener("focus",()=>{
            refresh(data)
        })
    },[navigation])
}