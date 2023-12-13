import React, { useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import MapView,{Marker} from "react-native-maps"
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../env';
import { darkMapCustomStyle } from '../../util/maps';

interface MapRouteProps {
    start_address :  Address 
    destination_address :  Address 
};

function MapRoute({start_address,destination_address}:MapRouteProps) {
    const ref= useRef<MapView |null>(null)
   
    return (
    <MapView 
        ref={ref}
        // onMapReady={()=>)}
        onMapLoaded={()=>{
            ref.current?.fitToSuppliedMarkers(["Start","Destination"],{
                edgePadding:{
                    top:50,right:50,
                    left:50,bottom:50
                }, 
                animated:true
            })
        }}
        style={{...StyleSheet.absoluteFillObject,borderRadius:10}}
        customMapStyle={darkMapCustomStyle}
        initialRegion={{
            ...start_address.localisation,
            longitudeDelta:0.005 , 
            latitudeDelta:0.005 , 
        }}
    >
        {[{...start_address,title:"Start"},{...destination_address,title:"Destination"}].map((address)=>(
            <Marker 
                key={address.title} 
                coordinate={{...address.localisation}} 
                title={address.title} 
                description={address.formatted_address||address.name}
                identifier={address.title} 
            />
        ))}
        <MapViewDirections
            origin={start_address.localisation}
            destination={destination_address.localisation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeColor='#4285F4'
            strokeWidth={5}
        />
    </MapView>
    );
};

export default MapRoute;