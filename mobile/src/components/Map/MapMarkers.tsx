import React, { ReactNode, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native'
import MapView,{Marker} from "react-native-maps"
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../env';
import { useLocalisationStore } from '../../context/store';
import { calculateCircleDistance, darkMapCustomStyle } from '../../util/maps';
interface MapMarkersProps {
    markers : MapMarker[]
    Marker ?: ReactNode
    setRideData ? : ({distance,time}:RideInformations)=>void 
    can_fit_markers ? : boolean
    draw_road ? : boolean
    onZoomOut ?: (radius:number)=>void | Promise<void|any> 
};



function MapMarkers({markers,setRideData,can_fit_markers=true,draw_road=true,onZoomOut}:MapMarkersProps) {
    const ref= useRef<MapView |null>(null); 
    const longitudeDeltaRef = useRef<number | null>(null);
    const circleDistanceRef = useRef<number |null>(null); 
    const unified_markers = markers?.map((marker)=>
        "address" in marker
        ?   {
                ...marker,
                ...marker.address, 
                localisation: marker.address.localisation,
                Marker:marker.Marker,
            }
        :   marker
    ); 
    const number_markers = unified_markers?.length; 
    const {localisation} = useLocalisationStore()
    const initialRegionLocalisation = markers.length!=0 && ("address" in markers[0]? markers[0].address.localisation : markers[0].localisation); 
    const fitToMarkers = ()=>{
        if(can_fit_markers)
            ref?.current?.fitToSuppliedMarkers(markers.map((marker)=>marker.title),{
                edgePadding:{
                    top:50,right:50,
                    left:50,bottom:50
                }, 
                animated:true
            })
    }
    useEffect(()=>{
        if(markers?.length)
            fitToMarkers()
    },[markers])
    
    if(!markers||!localisation)
        return null ;
    return (
    <MapView 
        ref={ref}
        // onMapReady={()=>)}
        onMapLoaded={()=>{
            if(can_fit_markers)
                ref?.current?.fitToSuppliedMarkers(markers.map((marker)=>marker.title),{
                    edgePadding:{
                        top:50,right:50,
                        left:50,bottom:50
                    }, 
                    animated:true
                })
        }}
        customMapStyle={darkMapCustomStyle}
        style={{...StyleSheet.absoluteFillObject,borderRadius:10}}
        initialRegion={!initialRegionLocalisation?{
            longitudeDelta:0.005 , 
            latitudeDelta:0.005 , 
            latitude: localisation!?.latitude, longitude : localisation!?.longitude
        }:{
            ...initialRegionLocalisation,
            longitudeDelta:0.005 , 
            latitudeDelta:0.005 , 
        }}
        onRegionChange={async({ longitudeDelta,latitudeDelta ,latitude}) => {
            if(longitudeDelta && circleDistanceRef && longitudeDelta == longitudeDeltaRef?.current)
                return 
            // detecting only zoom out 
            
            if(longitudeDeltaRef!=null && ( longitudeDelta<= longitudeDeltaRef?.current!))
                return longitudeDeltaRef.current = longitudeDelta;
            const circleDistance = calculateCircleDistance(latitudeDelta, longitudeDelta, latitude);
            if(circleDistanceRef!=null && circleDistanceRef?.current! >= circleDistance)
                return ; 
            circleDistanceRef.current = circleDistance;
            if(onZoomOut)
                onZoomOut(circleDistanceRef.current) 

          }}
    >
        {unified_markers?.map((marker,index)=>(
            <Marker 
                key={index} 
                coordinate={{...marker.localisation}} 
                title={marker.title} 
                description={"name" in marker ? (marker.name):marker.title}
                identifier={marker.title}
                onPress={()=>{
                    if(marker.onPress)
                        marker.onPress(markers[index])
                }} 
                
            >
                {marker.Marker!=undefined && <marker.Marker />} 
            </Marker>
        ))}
        {
            number_markers!=0 && number_markers!=1 && draw_road && (
                <MapViewDirections
                    origin={unified_markers[0].localisation}
                    destination={unified_markers[unified_markers.length-1].localisation}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeColor='#4285F4'
                    strokeWidth={5}
                    optimizeWaypoints = {true}
                    timePrecision = {"now"}
                  
                    onReady={(result)=>{
                        const distance_in_km = Math.round(result.distance)
                        const duration_in_min = Math.round(result.duration)
                        if(setRideData)
                            setRideData({distance:distance_in_km,time:duration_in_min})
                    }}
                    resetOnChange={true}
                    mode='DRIVING'
                    
                />
            )
        }
    </MapView>
    )
};

export default MapMarkers;