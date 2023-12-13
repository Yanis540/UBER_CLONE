import React from 'react';
import { Text, View } from 'react-native'
import { statusBarMargin } from '../../../../styles';

interface DriverCarsProps {

};

function DriverCars({}:DriverCarsProps) {
    return (
        <View style={statusBarMargin}>
           <Text>DriverCars</Text>
        </View>
    );
};

export default DriverCars;