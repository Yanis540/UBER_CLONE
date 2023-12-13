import React, { useRef , useCallback } from 'react';
import { View} from 'react-native'
import { statusBarMargin } from '../../../../../styles';
import ProfileInformations from './components/ProfileInformations';
import LogoutButton from './components/LogoutButton';

import {BottomSheetModal as GorhomBottomSheetModal,} from '@gorhom/bottom-sheet';
import ProfilePhotoUpdate from './components/ProfilePhotoUpdate';
import Routes from '../../../../../components/Routes/Routes';
import { useProfileRoutes } from './hooks/use-profile-routes';
interface ProfileProps {

};



function Profile({}:ProfileProps) {
    const routes = useProfileRoutes(); 
    const bottomSheetModalRef = useRef<GorhomBottomSheetModal>(null);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    return (
    <View className="flex-1 flex flex-col  bg-white relative text-red-600" style={statusBarMargin}>
        <ProfileInformations onLongPress={handlePresentModalPress} /> 
        <Routes routes={routes} /> 
        <LogoutButton /> 
        <ProfilePhotoUpdate bottomSheetModalRef={bottomSheetModalRef} /> 
      
    </View>
    );
};
export default Profile;