
import {point,distance} from "@turf/turf"
import {z} from "zod"
/**
 * 
 * @param localisation1 : lat & long of first point
 * @param localisation2 : lat & long of first point
 * @returns distance between two points in KM
 */
export const calculateDistancePoints = (from_localisation:Point,to_localisation:Point)=>{

    // [long , latitude]
    const from = point([from_localisation.longitude,from_localisation.latitude])
    const to = point([to_localisation.longitude,to_localisation.latitude])
    const distance_km = distance(from,to,{units:"kilometers"}) // km 
    return distance_km ; 
}
export const isNearby = (from_localisation:Point,to_localisation:Point,radius?:number)=>{
    const radiusSchema = z.number().min(1).max(20).optional().default(5); 
    const schema_parsed = radiusSchema.safeParse(radius)
    const radius_in_use = schema_parsed.success?schema_parsed.data : 5 
    const near = calculateDistancePoints(from_localisation ,to_localisation!) <= radius_in_use
    return near
}
/**
 * 
 * @param param0 
 * @returns IDS of the drivers nearby 
 */
export const drivers_nearby = ({localisation,drivers,radius}:{localisation:Point,drivers:UserDriver[],radius?:number})=>{
    const available_drivers = drivers?.filter((user_driver)=>{
        if(!(user_driver?.localisation )|| ! (user_driver.driver))
            return false; 
        const isAvailable = user_driver.driver!.isAvailable; 
        const isNear = isNearby(localisation,user_driver.localisation,radius)
        return isAvailable&& isNear
    });
    const available_drivers_ids =available_drivers.map((driver)=>driver.id); 
    return available_drivers_ids;
}
