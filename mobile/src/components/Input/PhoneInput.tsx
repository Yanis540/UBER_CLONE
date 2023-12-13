import React, { forwardRef } from 'react';
import { Text, View } from 'react-native'
import ReactNativePhoneInput from 'react-native-phone-input';

interface PhoneInputProps {
    /** default number  */
    initialValue ? : string 
    className ? : string 
};

const PhoneInput = forwardRef<any,PhoneInputProps>(({initialValue, className},ref)=> {
    return (
    <View className={className??"border-[1px] border-gray-200 rounded-lg px-4 py-5"}>
        <ReactNativePhoneInput 
            ref={ref as any}
            initialCountry={'us'}
            initialValue={initialValue??""}
            textProps={{
                placeholder: 'Enter a phone number...'
            }}
        />
    </View>
    );
});

export default PhoneInput;