import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useDeleteComment } from '../../../../hooks/comments';
import { AntDesign , FontAwesome5  } from '@expo/vector-icons';
interface DeleteCommentProps {
    comment ?: Comment 
    visible ?: boolean 
    close : ()=>void 
};

function DeleteComment({comment,visible,close}:DeleteCommentProps) {
    const {delete_comment,isLoading} = useDeleteComment(comment?.id??""); 
    const handleDelete = ()=>{
        delete_comment()
        close(); 
    }
    if(!visible) 
        return null 
    if(isLoading){
        <View className="flex flex-row items-center justify-center bg-sky-400  rounded-sm py-4 px-5   ">
            <ActivityIndicator color="white" />
        </View>
        
    }
    return (
        <View className="flex flex-row items-center justify-between bg-sky-400  rounded-sm py-4 px-5   ">
            {/* Clos */}
            <View>
                <TouchableOpacity onPress={close}>
                    <AntDesign name="close" size={24} color="white"  />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={handleDelete}>
                    <FontAwesome5 name="trash" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DeleteComment;