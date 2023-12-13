import React,{useMemo} from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { uberFont } from '../../../../styles';
import { useAuth } from '../../../../context/store';
import { useLikeComment } from '../../../../hooks/comments';
import { AntDesign } from '@expo/vector-icons';
interface CommentLikeButtonProps {
    comment: Comment
};

function CommentLikeButton({comment}:CommentLikeButtonProps) {
    const {user} = useAuth();
    const isLikedByUser = useMemo(()=>comment?.liked_by.length !=0,[comment?.id,comment?.liked_by]); 
    const {like} = useLikeComment(comment.id)
    const handleAddLike = ()=>{
        like({type:isLikedByUser?"unlike":"like"})
    }
    return (
    <View className="flex flex-col items-center justify-center mt-2  ">
        {/* Like component */}
        <TouchableOpacity onPress={handleAddLike}>
            <AntDesign name={isLikedByUser?`heart`:"hearto"} size={20} color={isLikedByUser?"rgb(239 68 68)":"black"} /> 
        </TouchableOpacity>
        <Text style={uberFont} className={`${isLikedByUser?"text-red-500":"text-gray-800"} text-[11px]`}>{comment._count?.liked_by}</Text>
        {/*  */}
   </View>
    );
};

export default CommentLikeButton;