import { AxiosError } from "axios"

export const handleErrorMessage = (err:any)=>{
    if(err instanceof AxiosError){
        return err?.response?.data?.error?.message
            ?   err?.response?.data?.error?.message as string
            :   err.status == 401 ? "Unauthorized" : "Internal Server Error please try again"
            
    }
    return "Unexpected error"
}