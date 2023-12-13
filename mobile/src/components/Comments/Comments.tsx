import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, Text, View, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import { useComments } from '../../hooks/comments';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetFlatList, TouchableOpacity } from '@gorhom/bottom-sheet';
import { uberFont } from '../../styles';
import CommentComponent from './components/Comment/CommentComponent';
import { forNoAnimation } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/CardStyleInterpolators';
import { useAuth } from '../../context/store';
import CommentForm from './components/Form/CommentForm';
import { useLikeComment } from '../../hooks/comments/use-like-comment';
import { KeyboardLayout } from '../../layout';
import DeleteComment from './components/Delete/DeleteComment';
import { useInfiniteComments } from '../../hooks/comments/use-infinite-comments';

interface CommentsProps {
    driverId : string
    read_only ? : boolean
};

function Comments({driverId,read_only=false}:CommentsProps) {
    const {user} = useAuth();

    const [selectedComment,setSelectedComment] = useState<Comment|undefined>(undefined); 

    // const {data,isLoading,error,refreshing,onRefresh} = useComments(driverId,0);
    const {data,isLoading,error,refreshing,onRefresh,more} = useInfiniteComments(driverId);  // infinite
    const handleLongPress=(comment:Comment)=> {
        // display the component to delete the comment 
        setSelectedComment(comment)
    }; 
    if(error|| data.error || (!isLoading && !refreshing && !data.comments))return(
    <View className="flex-1 flex flex-col">
        <View className="px-2 border-b-[1px] border-gray-200">
            <Text style={uberFont} className="text-xl font-bold py-2" >Comments</Text>
        </View>
        <View className='flex-1 flex-col items-center  justify-center  ' >
            <TouchableOpacity onPress={onRefresh}>
                <Ionicons name="refresh" size={24} color="black"   />
            </TouchableOpacity>
        </View>
    </View>
    )
    if(isLoading ) return (
        <View className="flex flex-col items-center justify-center bg-white ">
            <ActivityIndicator color="black" />
        </View>
    )
    return (
    // <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : "height"}>
    
    <KeyboardLayout>
        <View className='flex-1 flex flex-col ' >
            <View className="border-b-[1px] border-gray-200">
                <TouchableOpacity onPress={onRefresh}>
                    <Text style={uberFont} className="text-xl font-bold py-2 px-2 " >Comments</Text>
                </TouchableOpacity>
                <DeleteComment 
                    close={()=>{setSelectedComment(undefined)}}   
                    visible={!!selectedComment}
                    comment={selectedComment}
                />
            </View>
           <View className="flex-1 flex flex-col  ">

                <BottomSheetFlatList 
                    data={data.comments}
                    className="flex-1 "
                    onEndReached={()=>{
                        if(more.hasNext == false)
                            return 
                        more.load()
                    }}
                    onEndReachedThreshold={0}
                    refreshControl={<RefreshControl className="flex-1 bg-white px-5 py-2 " refreshing={refreshing} onRefresh={onRefresh}  />}
                    keyExtractor={(comment)=>comment.id}
                    renderItem={({item,index})=>
                        <CommentComponent 
                            onLongPress={handleLongPress} comment={item} 
                            isSelected={item.id == selectedComment?.id} 
                            isLast= {index == (data.number_comments-1)}
                            isFetchingNext = {more.isLoading}
                        />
                    }
                />
            {
                !read_only && user?.role!="DRIVER" && (
                    <CommentForm driverId={driverId} /> 
                )
            }
                
           </View>
        </View>
    </KeyboardLayout>
    // </KeyboardAvoidingView>
    );
};

export default Comments;