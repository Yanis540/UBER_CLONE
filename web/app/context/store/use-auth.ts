import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  user?:  User
  set_user: (user?:  User) => void
}

const useAuth =  create(
    persist<AuthState>(
        (set:any,get:any)=>({
            user : undefined, 
            set_user : (user?:User)=>set((prev:AuthState)=>{
                return {...prev,user:user}
            }),
        }), 
        {
            name:"store-auth", 
            storage: createJSONStorage(()=>localStorage)
        }
    )
)



export {
    useAuth
}