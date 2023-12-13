import { create } from 'zustand'

interface LocalisationStoreState {
  localisation?:  Point
  set_localisation: (localisation:Point) => void
}

const useLocalisationStore =  create<LocalisationStoreState>(
    (set:any,get:any)=>({
        localisation : undefined,
        set_localisation : (localisation:Point)=>set((prev:LocalisationStoreState)=>{
            return {...prev,localisation}
        }),

    }), 
      
)



export {
    useLocalisationStore
}


