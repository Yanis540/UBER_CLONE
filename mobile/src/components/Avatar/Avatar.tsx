import React, { useState } from 'react';
import { Image, View , Modal, TouchableOpacity} from 'react-native'
import { default_user_img } from '../../styles';
interface AvatarProps {
    onLongPress ?: ()=>void
    onPress ?: ()=>void  
    src ? : string 
    isOnline ? : boolean
    show_status ? : boolean 
};

function Avatar({onPress,onLongPress,src,show_status, isOnline}:AvatarProps) {
    const [isModalOpen,setIsModalOpen]  = useState<boolean>(false); 
    return (
    <>
        <TouchableOpacity onLongPress={onLongPress} onPress={onPress ? onPress :   ()=>setIsModalOpen(true)}>
            <View className="w-[64px] h-[64px] relative">
                <Image source={{uri:src??default_user_img}} className="w-full h-full rounded-full" />
                {
                    show_status && (
                        <View 
                            className={`
                                absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white ${isOnline?"bg-emerald-400":"bg-red-500"} border-[1px] animate-pulse border-gray-300 rounded-full top-0 right-1 dark:border-gray-900`} 
                        />
                    )
                } 
            </View>
        </TouchableOpacity>
        <Modal animationType='fade' transparent={true} visible={isModalOpen}  >
            <View className=" flex-1 flex flex-col items-center justify-center h-full " >
                
                {/* <View className='flex flex-col  items-center justify-center w-full  h-full  rounded border'> */}
                    <View className="w-[120px] h-[120px] z-[999] ">
                        <Image source={{uri:src??default_user_img}} className="w-full h-full rounded-full" /> 
                    </View>
                {/* </View> */}
            </View>
            <TouchableOpacity 
                onPress={()=>setIsModalOpen(false)} activeOpacity={1}
                className="flex-1 absolute top-0 right-0 left-0 bottom-0 w-full h-full z-0"
                style={{backgroundColor:"rgba(0,0,0,0.35)",}} 
            >
                {/* <ImageBackground className="flex-1" source={{}} blurRadius={90} />  */}
            </TouchableOpacity>
        </Modal> 
    </>
    );
    };

export default Avatar;