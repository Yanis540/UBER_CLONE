import axios from "axios"
import { GOOGLE_MAPS_APIKEY } from "../../env";
export  const darkMapCustomStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];

export const getVicinityFromGeolocation = async(localisation : Point)=>{
  //! 4 dollars per each 1000 req, it's not huge compared to search nearby which is 25.6 for 1000 
  const responsePlaces = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${localisation.latitude},${localisation.longitude}&key=${GOOGLE_MAPS_APIKEY}`)
  const placesData = await responsePlaces.data ; 
  if(!placesData|| placesData.status!="OK")
    return undefined ; 
  const results = placesData.results; 
  if(!results)
    return undefined ; 
  const addressComponents = results[0].address_components ; 
  if(!addressComponents|| addressComponents?.length<2)
    return undefined ; 
  const vicinities = (addressComponents as any[]).slice(1).map((address)=>address.short_name); 
  return vicinities
}


/**
 * 
 * @returns circle conference in KM
 */
export const calculateCircleDistance = (latitudeDelta:number, longitudeDelta:number, latitude:number)=> {
  const equatorCircumference = 40000; // Earth's Circumference at Equator in km
  const latitudeRadians = (latitude * Math.PI) / 180;
  
  // Convert deltas to kilometers
  const latitudeDistance = latitudeDelta * equatorCircumference / 360;
  const longitudeDistance = longitudeDelta * equatorCircumference / 360 * Math.cos(latitudeRadians);
  
  // Calculate the circle's radius
  const radius = Math.max(latitudeDistance, longitudeDistance);
  
  // Calculate the distance covered by the circle
  const circleDistance = 2 * Math.PI * radius;
  
  return Math.round(circleDistance);
}
