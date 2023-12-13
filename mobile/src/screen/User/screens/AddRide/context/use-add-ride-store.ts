
import { create } from 'zustand'

interface AddRideStoreState {
  origin ?: AddressMarker 
  destination ?: AddressMarker 
  starting_at ? : Date 
  informations ? :RideInformations
  car_type ?: CarType 
  payment_type ? : PaymentType
  set_informations : (informations ? :RideInformations)=>void 
  set_location: ({address,type}:{address?:  AddressMarker,type:"origin"|"destination"}) => void
  set_car_type : (car_type?:CarType)=>void
  set_payment_type : (payment_type : PaymentType)=>void 
  clear_store : ()=>void 
  set_starting_at :  (date?: Date)=> void  

}

const useAddRideStore =  create<AddRideStoreState>(
    (set:any,get:any)=>({
        origin : undefined , 
        destination : undefined , 
        payment_type: undefined , 
        set_location : ({address,type}:{address?:  AddressMarker,type:"origin"|"destination"})=>set((prev:AddRideStoreState)=>{
            if(type=="origin")return {...prev,origin:address}
            return {...prev,destination:address}
        }),
        set_informations: (informations ? :RideInformations)=>set((prev:AddRideStoreState)=>{
            return {...prev,informations}
        }),
        set_car_type: (car_type?:CarType)=>set((prev:AddRideStoreState)=>{
            return {...prev,car_type}
        }),
        set_payment_type : (payment_type : PaymentType)=>set((prev:AddRideStoreState)=>{
            return {...prev,payment_type}
        }),
        clear_store : ()=>set((prev:AddRideStoreState)=>{
            return {...prev, 
                origin:undefined , 
                destination : undefined , 
                informations : undefined , 
                car_type:undefined , 
                payment_type:undefined
            }as AddRideStoreState
        }), 
        set_starting_at : (date?: Date)=>set((prev:AddRideStoreState)=>{
            return {...prev, 
                starting_at : date
            }as AddRideStoreState
        }), 
        
    }), 
      
)



export {
    useAddRideStore
}


