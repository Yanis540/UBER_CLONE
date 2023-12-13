import { Response } from "express"
import { db } from "../../../libs/db"
import { AddressError } from "../types"

const add_new_address = async(address_id:string,res:Response)=>{
    const address = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${address_id}&key=${process.env.GOOGLE_MAPS_APIKEY}`).then(res=>res.json())
    if(!address || address.status!="OK"){
        res.status(404)
        throw new Error("Address Not Found",{cause:AddressError.ADDRESS_NOT_FOUND})
    }; 
    const created_address = await db.address.create({
        data:{
            id:address_id ,
            name: address.result.name, 
            formatted_address: address.result.formatted_address, 
            place_id: address.result.place_id, 
            vicinity: address.result.vicinity, 
            localisation:{
                longitude:address.result.geometry.location.lng,
                latitude:address.result.geometry.location.lat,
            }
        }
    })
}
export {add_new_address}