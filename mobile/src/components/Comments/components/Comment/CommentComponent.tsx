import React, { useMemo } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

import { Rating } from 'react-native-ratings';
import { default_user_img, uberFont } from '../../../../styles';
import { useAuth } from '../../../../context/store';
import CommentLikeButton from '../Button/CommentLikeButton';
import CommentBody from './components/CommentBody';
interface CommentComponentProps {
    comment : Comment
    onLongPress : (comment:Comment)=>void
    isSelected : boolean
    isLast: boolean
    isFetchingNext : boolean 
};

function CommentComponent({comment,onLongPress,isSelected,isLast, isFetchingNext}:CommentComponentProps) {
 
    return (
    <>
        <View className={`flex flex-row items-start px-5 py-4 ${isSelected && "bg-gray-100 bg-opacity-10 rounded-lg"} `}>
            {/* Image */}
            <View  className="w-[38px] h-[38px]  mt-2">
                <Image source={{uri:comment?.user?.photo??default_user_img!}} className="h-full w-full rounded-full" />
            </View>
            <CommentBody comment={comment} onLongPress={onLongPress} /> 
            <CommentLikeButton comment={comment} /> 
        </View>
        {
            isLast && isFetchingNext&&(
            <View className={`${isLast?"flex":"hidden"} flex-row items-center justify-center mb-2 py-2`}>
                <ActivityIndicator color="black" /> 
            </View>
            )
        }
    </>
    );
};

export default CommentComponent;