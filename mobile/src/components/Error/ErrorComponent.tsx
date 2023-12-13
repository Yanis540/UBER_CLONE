import React from 'react';
import { Text, View } from 'react-native'

interface ErrorComponentProps {
    data:{
        error?:{message:string}
    }&any
    error?:unknown
};

function ErrorComponent({data,error}:ErrorComponentProps) {
    return (
        <View className="flex-1 flex flex-col items-center justify-center bg-white ">
            <Text className="font-bold text-xl text-gray-400">{data?.error?.message??"An Error occured ! "}</Text>
        </View>
    );
};

export default ErrorComponent;