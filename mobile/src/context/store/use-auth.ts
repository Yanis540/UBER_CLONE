import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  user?:  User
  set_user: (user?:  User) => void
  set_ratings  : (ratings:Rating[])=>void 
}

const useAuth =  create(
    persist<AuthState>(
        (set:any,get:any)=>({
            user : undefined, 
            set_user : (user?:User)=>set((prev:AuthState)=>{
                return {...prev,user:user}
            }),
            set_ratings : (ratings:Rating[])=>set((prev:AuthState)=>{
                return {...prev,user:!prev.user?undefined:{...prev.user,ratings:ratings}}
            }),
        }), 
        {
            name:"store-auth", 
            storage: createJSONStorage(()=>AsyncStorage)
        }
    )
)



export {
    useAuth
}