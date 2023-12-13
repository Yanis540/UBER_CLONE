import { GooglePlaceData, GooglePlaceDetail } from "react-native-google-places-autocomplete"
import {z} from "zod" ;
import { Socket } from "socket.io-client"; 
import { NavigatorList } from "./src/routes/main";
export {}
const ratingSchema=  z.number().min(1).max(5); 
declare global {
    type EmitSocketEvents ="driver:localisation"|"user:track-drivers" |"user:untrack-driver"|"driver:is-available"|"disconnect"
    type ListenSocketEvents = "driver:localisation"|"user:connection"|"driver:is-available"|"driver:disconnected"|"driver:ride-proposed"|"user:ride"
    type Screen = {
        name: string;
        navigate: () => void;
    }
    type RouteCategorie = {
        name:string,Icon?:any, screens:Screen[]
    }
    type GlobalStacks = keyof NavigatorList 
    type PushEvent = "ride" 
    type NotificationData = {
        event : PushEvent
        body ?: any
    }
    type RideInformations = {
        distance: number 
        time: number 
    }
    

    type RatingSchema = z.infer<typeof ratingSchema>
    type CloudPhotoDetails = {
        access_mode  : string 
        asset_id : string 
        public_id : string   
        bytes : number 
        created_at : string 
        etag : string 
        folder : string 
        format : string 
        height : number 
        original_extension : string 
        original_filename : string 
        placeholder : boolean  
        resource_type : string   
        secure_url : string   
        signature : string   
        tags : any[]   
        url : string  
        version : number  
        version_id : string  
        width : number  
    }
    type GoogleAutoCompleteData = {
        data:GooglePlaceData,
        details:GooglePlaceDetail|null
    }
    type AddressMarker = {
        address : Address 
        title : string  
    }
    type LocalisationMarker = {
        title : string 
        localisation : Point 
        name :string  
    }
    type MapMarker = (AddressMarker| LocalisationMarker)& {
        Marker ?: ()=>React.JSX.Element
        onPress ?: (mapMarker : MapMarker)=>void 
    }
    interface RideMapMarker extends MapMarker{
        ride_id:string 
    }
    type AuthCredentials = {
        access: {
            token: string 
            expiresIn : number 
        }, 
        refresh:{
            token : string 
        }
    }
    
    type  User=  {
        id : string 
        name : string 
        email :string 
        address ?: string 
        photo ? : string 
        cloud_photo ? : CloudPhotoDetails
        phone_number : string 
        created_at : string 
        isDeleted : boolean 
        isValid : boolean 
        hashedPassword ?: string 
        role  : Role 
        driver ?: Driver 
        localisation ?: Point
        prefered_payment_type : PaymentType 
        ratings : Rating []
        comments : Comment []
        drivers_commented_on : Driver []
        liked_comments : Comment[]
        rides : Ride []
        push_tokens: PushNotificationToken[]
        push_token_value ? : string 
        push_token : PushNotificationToken
        tokens ?:AuthCredentials 
        
        _count?:{
            rides:true
        }
   }
   type PushNotificationToken = {
        token : string 
        user_id : string 
        user : User 
        created_at : string 
        currently_used ?: User 
   }
   
    type Driver =  {
        licence_id:    string
        user : User 
        cars : Car[]
        total_rating : number 
        ratings : Rating []
        comments : Comment []
        users_commented : User []
        isAvailable ? : boolean 
        rides : Ride []
        _count:{
            comments:number
            ratings : number 
            rides : number 
        }
    }
    type Car  = {
        car_id : string        
        car_type : CarType
        car_model : string
        registration_date ?: DateTime
        licence_id : string
        driver : Driver    
        rides : Ride[]
    }
    enum CarType {
        standard="standard", 
        premium="premium", 
        family="family", 
        suv="suv"
    }
    type Rating = {
        licence_id : string 
        driver : Driver 
        user_id : string 
        user : string 
        rating : nmber
    }
    type Comment = {
        id :string 
        text : string 
        commented_at : string 
        updated_at : string 
        user_id : string 
        user: User 
        licence_id : string 
        driver : Driver 
        liked_by : User []
        _count?:{
            liked_by : number
        }
    }
    type Address  = {
        id : string 
        name ?: string 
        formatted_address ? : string 
        place_id ? : string 
        vicinity : string 
        localisation : Point 
        start_rides : Ride []
        destination_rides : Ride []
    }
    type Point = {
        longitude: number;
        latitude: number;
    }
    type Ride = {
        id : string 
        user_gps_localisation: Point 
        user_id : string 
        user : User 
        driver_licence_id : string 
        driver : Driver 
        car_type : CarType
        car_id ? : string 
        car ?: Car  
        // time stuff 
        ordered_at : string 
        starting_at ?: string 
        arrived_at ?: string     
        total_time ?: string // estimated time 

        // travel stuff 
        start_address_id : string
        start_address : Address 
        destination_address_id : string
        destination_address : Address 
        distance : number // in KM 

        // accepted by Driver 
        isAccepted :  boolean 
        accepted_at ?: string

        // cancelled 
        isCancelled : boolean
        cause_cancellation ?:  string
        isCancelledByDriver : boolean 

        // Payment Stuff 
        payment_type : PaymentType
        payment_status : PaymentStatus
        payment_intent ?: PaymentIntent
        total : number
        currency : string 

        // Ride Status
        ride_status : RideStatus 
    }
    type PaymentIntent ={
        id : string 
        payment_gateway : PaymentGateway 
        stripe_payment_intent ?: StripePaymentIntent
        ride_id ?: string 
        ride ?: Ride  
    }
    type StripePaymentIntent ={
        id : string
        payment_intent : PaymentIntent 
        client_secret : string
        ephemeralKey_secret : string
        customer_id : string
    }
    
  
    enum Role {
        ADMIN="ADMIN", 
        REGULAR = "REGULAR", 
        DRIVER = "DRIVER"
    }
      
    export enum RideStatus {
        proposed= "proposed",
        accepted= "accepted",
        progress= "progress",
        cancelled= "cancelled",
        finished= "finished",
    }
    
    enum PaymentStatus {
        succeeded="succeeded", 
        cancelled="cancelled", 
        processing="processing", 
        refunded="refunded", 
    }
    
    enum PaymentType {
        cash="cash", 
        card="card"
    }
    
    enum PaymentGateway {
        stripe="stripe"
    }
}
import {ReservedOrUserEventNames,ListenEvents} from "socket.io-client"
declare module "socket.io-client"{
    interface Socket {
        userId: string 
    }
}
const global_style = {
    fontFamily:"uber"
}