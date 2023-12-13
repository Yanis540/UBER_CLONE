import React from 'react';
import { Text, View } from 'react-native'
import { uberFont } from '../../../../styles';

interface ProvidersProps {

};

function Providers({}:ProvidersProps) {
    return (
        <View className="mt-6">
            <View className="relative">
                <View className="absolute inset-0 flex items-center w-full mx-auto px-5">
                    <View className="w-full border-t border-gray-400" />
                </View>
                <View className='my-3 relative flex justify-center items-center text-sm '>
                    <Text style={uberFont} className=' px-2 text-gray-200'>
                        Or continue with
                    </Text>
                </View>

            </View>
            <View className='mt-6 flex gap-2'>
                <View><Text className="text-white" >Google</Text></View>
            </View>
        </View>
    );
};

export default Providers;