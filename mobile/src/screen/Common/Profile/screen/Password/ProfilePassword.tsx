import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native'
import { statusBarMargin } from '../../../../../styles';
import ProfileStackHeader from '../../components/ProfileStackHeader';
import { useUpdateUser } from '../../hooks/use-update-user';
import { KeyboardLayout } from '../../../../../layout';
import ProfilePasswordForm from './components/ProfilePasswordForm';

interface ProfilePasswordProps {

};

function ProfilePassword({}:ProfilePasswordProps) {
    const {updateAsync} = useUpdateUser(); 

    return (
    <View className="flex-1 flex  bg-white " style={statusBarMargin}>
        <ProfileStackHeader label="Password" /> 
        <KeyboardAvoidingView style={{flex:1}}  behavior={Platform.OS === 'ios' ? 'padding' : "height"}>
            <SafeAreaView className="flex-1">
                <KeyboardLayout>
                    <ProfilePasswordForm onSubmit={updateAsync} /> 
                </KeyboardLayout>
            </SafeAreaView>
        </KeyboardAvoidingView>
    </View>
    );
};

export default ProfilePassword;