import React from 'react';

import { Text, View, StatusBar , KeyboardAvoidingView , Platform , SafeAreaView, Image } from 'react-native'
import {KeyboardLayout} from '../../../layout';
import { useNavigation } from '../../../routes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useLogin } from './hooks/use-login';
import LoginForm from './components/LoginForm';
import Providers from './components/Providers';
import { statusBarMargin } from '../../../styles';

interface LoginProps {

};

function Login({}:LoginProps) {
    const {navigation} = useNavigation()
    const {data,isLoading,error,login} = useLogin() ;
 
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
                        <LoginForm onSubmit={login} /> 
                    </View>
                    {/* <Providers />  */}
                </View>
            </KeyboardLayout>
        </SafeAreaView>
    </KeyboardAvoidingView>
    );
};

export default Login;