import React from 'react';
import { View  , TextInput , Text,TouchableOpacity, ScrollView, FlatList , ActivityIndicator } from 'react-native'
import {toFormikValidationSchema} from "zod-formik-adapter"
import { loginSchema , LoginSchema } from '../types';
import {Formik} from "formik";
import { useNavigation } from '../../../../routes';
import Input from '../../../../components/Input/Input';
import { uberFont } from '../../../../styles';
interface LoginFormProps {
  onSubmit : (data: LoginSchema) => Promise<void>
};


function LoginForm({onSubmit }:LoginFormProps) {
  const {navigation} = useNavigation(); 
  return (
  <Formik<LoginSchema>
    initialValues={{email: "",password:"",}}
    onSubmit={async(values:any,actions:any) => {await onSubmit(values).catch((err)=>{}) }}
    validationSchema={toFormikValidationSchema(loginSchema)}
  >
    {
      ({handleChange,values,setFieldValue,errors,handleSubmit,touched,handleBlur,isSubmitting,})=>{
        return (
        <View className="flex-1  flex-col justify-center  mx-4  " >
          {/* Form InPUT   */}
          <View className="flex-1">
            <ScrollView  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="flex-1 flex flex-col mb-2 ">
              {/** Email */}
              <Input id={"email"} value={values.email} handleChange={handleChange} handleBlur={handleBlur} touched={touched.email} error={errors.email}  /> 
              <Input id={"password"} password value={values.password} handleChange={handleChange} handleBlur={handleBlur} touched={touched.password} error={errors.password}  /> 
            </ScrollView>
            {/* Button */}
            <TouchableOpacity   onPress={handleSubmit as ()=>void}>
              <View className="flex flex-col items-center justify-center w-full bg-gray-100   mb-4 py-1 px-1 rounded-lg ">
                <Text style={uberFont} className="text-black font-semibold text-xl ">{!isSubmitting?"Log In":<ActivityIndicator color="black" />}</Text>
              </View>
              {/* register */}
              <View className='flex flex-row items-center justify-center gap-2 text-sm px-2 mb-2 '>
                <Text style={uberFont} className="text-gray-400">Don&apos;t have an account?</Text>
                <TouchableOpacity onPress={()=>{navigation.navigate("Auth",{screen:"register"})}} className="underline cursor-pointer ml-2">
                  <Text style={uberFont} className="text-white ">Register </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    } 
  
  </Formik>
  );
};

export default LoginForm;