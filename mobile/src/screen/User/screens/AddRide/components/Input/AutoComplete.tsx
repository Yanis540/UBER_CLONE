
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AutocompleteInput from './AutocompleteInput';
interface AutoCompleteProps {
    color : "red"|"blue" 
    placeholder : "Origin"|"Destination"
    setPlaceDetails : (params?:AddressMarker|undefined)=>void
    default_text ? : string 
    isEmpty : boolean 
};

function AutoComplete({color,setPlaceDetails, placeholder,default_text, isEmpty}:AutoCompleteProps) {
    
    return (
    <View className="flex-1 flex flex-row items-center   ">
        {/* From  */}
        <View className="">
            <FontAwesome5 name="map-marker-alt" size={24} color={color=="blue"?"rgb(59 130 246)":"rgb(239 68 68)"} />
        </View>
        <View className="flex-[0.9] flex items-center justify-center ml-5 mr-2  ">
            <AutocompleteInput 
                placeholder={placeholder} default_text={default_text} 
                isEmpty={isEmpty} setPlaceDetails={setPlaceDetails}
            /> 

        </View>
        {
            !isEmpty && (
            <View className="flex-[0.1] flex flex-col items-center   ">
                <TouchableOpacity onPress={()=>setPlaceDetails(undefined)}>
                    <MaterialIcons name="cancel" size={24} color="red" />
                </TouchableOpacity>
            </View>
            )
        }
        
    </View>
    );
};

export default AutoComplete;