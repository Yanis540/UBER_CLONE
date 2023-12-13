'use client'
import {ReactNode, useEffect} from 'react';
import { useAuth } from './store';
import { useRouter } from 'next/navigation'
interface AuthContextProps {
    children : ReactNode | ReactNode[]
};

function AuthContext({children}:AuthContextProps) {
    const router = useRouter(); 
    const {user} = useAuth();
    useEffect(()=>{
        if(!user?.id)
            router.push("/auth")
    },[user?.id,router])
    return (
    <>
        {children}
    </>
    );
};

export default AuthContext;