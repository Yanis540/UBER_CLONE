import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '../../../../../../env';

import { FontAwesome5 } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Styles } from 'react-native-google-places-autocomplete';
interface AutocompleteInputProps {
    isEmpty ?: boolean 
    default_text ? : string 
    placeholder: string 
    styles ? : Partial<Styles>
    setPlaceDetails : (params?:AddressMarker|undefined)=>void
};

function AutocompleteInput({isEmpty=true,default_text,placeholder,setPlaceDetails,styles}:AutocompleteInputProps) {
    const ref = useRef<GooglePlacesAutocompleteRef|null>(null);
    useEffect(()=>{
        ref?.current?.setAddressText(default_text??"")
    },[])
    useEffect(()=>{
        if(isEmpty)
            ref?.current?.setAddressText("")
    },[isEmpty])
    return (
    <GooglePlacesAutocomplete
        ref= {ref}
        placeholder={placeholder}
        fetchDetails={true}
        
        styles={styles??{
            // making the dropdown menu floating 
            listView: {
                position: 'absolute',
                top: placeholder=="Origin"?90:45,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderRadius: 5,
                flex: 1,
                width:"100%",
                elevation: 3,
                zIndex: 10
            },
            description: {
                color: 'black',
                fontFamily:'uber'
            },
            textInputContainer:{
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth:0,
                fontFamily:"uber",
                zIndex:999,
                width:"100%", // width of the content 
            },
            textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 45,
                fontFamily:"uber",
                fontSize: 16,
                borderRadius:7,
                padding:10, 
                borderColor:"rgb(209 213 219)", 
                borderWidth:1,
                zIndex:999,
            }
        }}
        onPress={(data, details ) => {
            // 'details' is provided when fetchDetails = true
            // console.log(data, details);
            const address:Address |undefined = 
            !details
            ?   undefined 
            :   {
                    ...details,
                    localisation:{
                        latitude:details?.geometry.location.lat,
                        longitude : details?.geometry.location.lng,
                    },
                    start_rides:[], 
                    destination_rides:[]
                }
            ;
            if(!address){
                setPlaceDetails(undefined)
                return ; 
            }
            setPlaceDetails({address:(address),title:placeholder})
        }}
        
        query={{
            key: GOOGLE_MAPS_APIKEY,
            language: 'en',
        }}
    />
    );
};

export default AutocompleteInput;