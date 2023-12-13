
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useToast } from 'react-native-toast-notifications';
import { useLocalisationStore } from '../context/store';

const useLocation = ()=>{
  const [errorMsg, setErrorMsg] = useState<string>("");
  const {localisation,set_localisation} = useLocalisationStore()
  const toast = useToast(); 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toast.show('Permission to access location was denied',{type:"error",});
        return;
      }
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      set_localisation({
        latitude:location.coords.latitude,
        longitude:location.coords.longitude
      });
    })();
  });
  return {localisation}
}

export {useLocation}