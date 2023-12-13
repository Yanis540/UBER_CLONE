import {useState,useCallback, useEffect} from "react"
import { useFocusScreen } from "./use-focus-screen";

export const useRefresh = (refresh:(data?:any)=>void,data?:any):[boolean,()=>Promise<void>] =>{
    const [refreshing,setRefreshing] = useState<boolean>(false); 
    const onRefresh = useCallback(async() => {
        try{
            setRefreshing(true);
            await refresh(data)
        }
        catch(err){

        }
        finally{
            setRefreshing(false)

        }
    }, []);
    // useFocusScreen(onRefresh)
    return [refreshing,onRefresh]
}