import { UseMutateAsyncFunction, UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useToast } from "react-native-toast-notifications"
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } from "../env";
const page_size = 10 ; 



type DataResponse =CloudPhotoDetails

interface  useUploadImagesType {
    error: unknown 
    data ?: DataResponse    
    isLoading : boolean
    mutate:UseMutateFunction<any, unknown, void, unknown>
    mutateAsync:UseMutateAsyncFunction<DataResponse, unknown, void, unknown>
}


const useUploadImages = (selectLimit?:number)=>{
    const toast = useToast(); 
    const pickImages:(selectLimit?:number)=>Promise<(ImagePicker.ImagePickerAsset[] | null)> = async (selectLimit=1) => {
        // No permissions request is necessary for launching the image library
        try{

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
                selectionLimit:selectLimit, 
                base64:true
            });
            if(result.canceled)
                return null ; 
            return result.assets
        }
        catch(err:any){
            return null ; 
        }
    };
    const {data,isLoading,error,mutate:upload,mutateAsync:uploadAsync}:useUploadImagesType  = useMutation({
        mutationKey:["upload","images"], 
        mutationFn:async()=>{
            const assets = await pickImages(selectLimit);
            if(!assets)
                return undefined ; 
            const formData = new FormData()
            formData.append("file",{
                uri: assets[0].uri,
                type: 'image/jpeg',
                name: assets[0].fileName??"random.jpeg",
            }); 
            formData.append("api_key",CLOUDINARY_API_KEY)
            formData.append("upload_preset","dlekxljn")
           
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData , 
            {
                headers:{
                    'X-Requested-With': 'XMLHttpRequest', 
                    'Content-Type': 'multipart/form-data', 
                }
            } )
            const data = await response.data;
            return data ; 
        },
        onSuccess:(data)=>{
            if(!data)
                return ;
            return data ; 

        }, 
        onError:(err:any)=>{
            toast.show("Could not upload image",{type:"danger"})
        }
    }); 

    return {
        data:data,
        upload  ,
        uploadAsync, 
        isLoading,
        error
    }
}

export {
    useUploadImages
}