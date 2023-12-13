import React from 'react';
import { KeyboardAvoidingView, Platform,SafeAreaView,View } from 'react-native'
import { statusBarMargin } from '../../../../../styles';
import { useUpdateUser } from '../../hooks/use-update-user';
import ProfileDetailsForm from './components/ProfileDetailsForm';
import ProfileStackHeader from '../../components/ProfileStackHeader';
import { KeyboardLayout } from '../../../../../layout';



 
interface ProfileDetailsProps {

};

function ProfileDetails({}:ProfileDetailsProps) {
    const {updateAsync} = useUpdateUser(); 
    return (
    <View className="flex-1 flex  bg-white " style={statusBarMargin}>
        <ProfileStackHeader label="Profile Details" /> 
        <KeyboardAvoidingView style={{flex:1}}  behavior={Platform.OS === 'ios' ? 'padding' : "height"}>
            <SafeAreaView className="flex-1">
                <KeyboardLayout>
                    <ProfileDetailsForm onSubmit={updateAsync} /> 
                </KeyboardLayout>
            </SafeAreaView>
        </KeyboardAvoidingView>
    </View>

    );
};

export default ProfileDetails;