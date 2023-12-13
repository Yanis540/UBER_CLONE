import React from 'react';

import { View, StatusBar , KeyboardAvoidingView , Platform , SafeAreaView, Image } from 'react-native'
import {KeyboardLayout} from '../../../layout';

import RegisterForm from './components/RegisterForm';
import { useRegister } from './hooks/use-register';
import { statusBarMargin } from '../../../styles';

interface RegisterProps {

};

function Register({}:RegisterProps) {
    const {data,isLoading,error,register} = useRegister() ; 
    return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : "height"}>
        <SafeAreaView className="flex-1">
            <KeyboardLayout>
                <View className='flex-1 flex flex-col bg-black ' style={statusBarMargin}> 
                    {/* Image */}
                    <View className="flex flex-col items-center ">
                        <Image source={require("../../../../assets/images/uber-logo.jpg")}  className="h-[100px] w-[150px]"/>
                    </View>
                    {/* Form */}
                    <View className="flex-1">
                        <RegisterForm onSubmit={register} /> 
                    </View>
                    {/* <Providers />  */}
                </View>
            </KeyboardLayout>
        </SafeAreaView>
    </KeyboardAvoidingView>
    );
};

export default Register;