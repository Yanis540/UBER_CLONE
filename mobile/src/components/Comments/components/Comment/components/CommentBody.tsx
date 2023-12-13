import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import { uberFont } from '../../../../../styles';
import { Rating } from 'react-native-ratings';
import { useAuth } from '../../../../../context/store';

interface CommentBodyProps {
    comment : Comment 
    onLongPress : (comment:Comment)=>void

};

function CommentBody({comment, onLongPress}:CommentBodyProps) {
    const {user} = useAuth(); 
    const isUserWhoCommented = useMemo(()=>user?.id === comment.user.id,[comment?.user?.id]); 

    return (
        <View className="flex-1 mx-4   " >
            <TouchableOpacity onLongPress={()=>onLongPress(comment)} disabled={!isUserWhoCommented} >
                <View className="flex flex-col items-start pb-3 ">
                    <View className="flex flex-row items-center ">
                        <Text style={uberFont} className="font-light text-[13px] pb-1">
                            {comment?.user?.name} :
                        </Text>
                        <Text style={uberFont} className="font-light text-gray-500 text-[11px] ml-1 pb-1">
                            {new Date(comment.commented_at).toLocaleDateString()}
                        </Text>
                    </View>
                    {
                        comment.user.ratings?.length!=0&& (
                            <Rating 
                                type='custom' ratingCount={5} readonly={true} 
                                startingValue={Math.round(comment.user.ratings[0].rating)} 
                                imageSize={20}
                            /> 
                        )
                    }
                </View>
                
                <Text style={{...uberFont,fontWeight:"100"}} className="text-[14px] text-gray-500">
                    {comment.text}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CommentBody;