
import { create } from 'zustand'
import { useDriverStore } from './use-driver-store'

interface RideStoreState {
  ride?:  Ride
  isCancelling ?: boolean 
  isLoading ?: boolean
  isPaying ? : boolean 
  loading : (isLoading?:boolean)=>void
  paying : (isPaying ? : boolean)=>void  
  cancelling : (isCancelling ? : boolean)=>void  
  set_ride: (ride?:  Ride) => void
}

const useRideStore =  create<RideStoreState>(
    (set:any,get:any)=>({
        ride : undefined,
        isLoading : undefined , 
        set_ride : (ride?:Ride)=>set((prev:RideStoreState)=>{
            return {...prev,ride:ride}
        }),
        loading : (isLoading?:boolean)=>set((prev:RideStoreState)=>{
            return {...prev,isLoading}
        }),
        
        paying : (isPaying?:boolean)=>set((prev:RideStoreState)=>{
            return {...prev,isPaying,isLoading : isPaying}
        }),
        cancelling : (isCancelling?:boolean)=>set((prev:RideStoreState)=>{
            return {...prev,isCancelling,isLoading : isCancelling}
        }),
    }), 
      
)



export {
    useRideStore
}


