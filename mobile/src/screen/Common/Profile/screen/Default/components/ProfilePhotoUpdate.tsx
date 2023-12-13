import React, { useMemo, useState } from 'react';
import { Text, View , Image , TouchableOpacity, ActivityIndicator } from 'react-native'
import { EvilIcons,MaterialIcons, Feather } from '@expo/vector-icons';
import { useAuth } from '../../../../../../context/store';
import {BottomSheetModal as GorhomBottomSheetModal,} from '@gorhom/bottom-sheet';
import BottomSheetModal from '../../../../../../components/BottomSheet/BottomSheetModal';
import { default_user_img } from '../../../../../../styles';

import axios from 'axios';
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } from '../../../../../../env';
import { useUpadteProfilePicture } from '../../../hooks/use-update-user';

interface ProfilePhotoUpdateProps {
    bottomSheetModalRef ?: React.RefObject<GorhomBottomSheetModal>

};

function ProfilePhotoUpdate({bottomSheetModalRef}:ProfilePhotoUpdateProps) {
    const {user} = useAuth(); 
    const {update,isLoading,remove} = useUpadteProfilePicture();
    const snapPoints = useMemo(()=>['50%'],[]); 
    const options = [
        {name:"Upload",title:"Upload new Picture",Icon : ()=><EvilIcons name="image" size={30} color="black" />,onPress:()=>{update()}},
        {name:"Delete",title:"Remove Current Picture",color:"rgb(220 38 38)",Icon : ()=><Feather name="trash" size={30} color="rgb(220 38 38)" />,onPress:()=>{remove()}},
    ]
    return (
    <BottomSheetModal canClose={true} snapPoints={snapPoints} 
        ref_sheet={bottomSheetModalRef} >
        <View className="flex-1 flex  py-2  " >
        {
        isLoading? (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="black" /> 
            </View>
        ):(
        <>
            {/* Top show picture */}
            <View className="flex flex-col items-center justify-center  border-b-[1px] border-gray-200 px-5 py-3">
                <View className="w-[50px] h-[50px]">
                    <Image source={{uri:user?.photo??default_user_img}} className="w-full h-full rounded-full" /> 
                </View>
            </View>
            <View className="flex-1 flex flex-col  px-5 ">
                <View>
                    
                {
                    options.map((option)=>(
                    <TouchableOpacity key={option.name} onPress={option.onPress} >
                        <View  className="flex flex-row items-center py-4 mb-1  ">
                            <option.Icon /> 
                            <Text style={{color:option.color}} className="ml-3 font-semibold text-[14px] capitalize" >{option.title}</Text>
                        </View>
                    </TouchableOpacity>
                    ))
                }
                </View>
            </View>
        </>
        )}
        </View>
    </BottomSheetModal>  
    );
};

export default ProfilePhotoUpdate;