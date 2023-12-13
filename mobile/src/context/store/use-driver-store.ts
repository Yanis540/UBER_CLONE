
import { create } from 'zustand'

interface DriverStoreState {
  driver?:  Driver
  set_driver: (driver?:  Driver) => void
}

const useDriverStore =  create<DriverStoreState>(
    (set:any,get:any)=>({
        ride : undefined,
        set_driver : (driver?:Driver)=>set((prev:DriverStoreState)=>{
            return {...prev,driver}
        }),

    }), 
      
)



export {
    useDriverStore
}


