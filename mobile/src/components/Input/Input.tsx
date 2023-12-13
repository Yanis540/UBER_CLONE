import { FormikErrors, FormikValues } from 'formik';
import React from 'react';
import { Text, View , TextInput } from 'react-native'
import { uberFont } from '../../styles';

interface InputProps {
    handleChange :  {
        (e: React.ChangeEvent<any>): void;
        <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    }

    handleBlur : {
        (e: React.FocusEvent<any, Element>): void;
        <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    }
    touched ?: boolean 
    error ?: string
    value: any
    id : string 
    label? : string 
    password ? : boolean
    className ?: string
    hide_label ?:boolean 


};

function Input({id, label,handleChange ,handleBlur,touched,error , value,password, hide_label, className}:InputProps) {
    return (
    <View className={`flex flex-col ${!hide_label &&"py-4"}`} >
        {!hide_label&& (
            <Text style={uberFont} className="text-gray-300 mb-2">{label??id}</Text>
        )}
        <TextInput
            secureTextEntry={password}
            selectionColor={"white"}
            placeholderTextColor="white" 
            className={`${className} text-white border-[1px] p-4 rounded-lg ${(!touched || !error)?"border-gray-100":"border-red-500"}  `}
            onChangeText={handleChange(id)}
            onBlur={handleBlur(id)}
            placeholder={label??id}
            value={value}
            style={uberFont}
        /> 
        <InputError error={error} touched={touched} /> 
    </View>
    );
};
export function InputError({touched,error}:{  touched ?: boolean 
    error ?: string}) {
    return (
    <>
        {(touched && error)&& (
          <Text style={uberFont} className="text-red-500 w-full ml-[4px]  ">{error }</Text>
        )}
    </>
    );
};
export default Input;