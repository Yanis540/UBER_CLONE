import {useRef} from 'react';
import { RegisterSchema , registerSchema} from '../types';
import { View  , TextInput , Text,TouchableOpacity, ScrollView, FlatList , ActivityIndicator} from 'react-native'
import {toFormikValidationSchema} from "zod-formik-adapter"
import {Formik} from "formik";
import { useNavigation } from '../../../../routes';
import Input from '../../../../components/Input/Input';
import { uberFont } from '../../../../styles';
import { useAuth } from '../../../../context/store';
import { validatePhoneNumber } from '../../../../util/phone';
import { useToast } from 'react-native-toast-notifications';
import PhoneInput from '../../../../components/Input/PhoneInput';
interface RegisterFormProps {
  onSubmit : (data: RegisterSchema) => Promise<void>
};

function RegisterForm({onSubmit}:RegisterFormProps) {
  const {navigation} = useNavigation();
  const phoneRef = useRef<any | undefined>(undefined); 
  const toast = useToast(); 
  const handleSubmit = async(values:any,actions:any) => {
    const phone_number = validatePhoneNumber(phoneRef?.current?._reactInternals?.memoizedState?.value); 
    if(!phone_number)
      return toast.show("Invalid phone number",{type:"danger"})
    await onSubmit({...values,phone_number})
      .catch((err)=>{})
    ;
  } 
  return (
  <Formik<RegisterSchema>
    initialValues={{name:"",email: "",confirmPassword:"",password:"",address:"",phone_number:""}}
    onSubmit={handleSubmit}
    validationSchema={toFormikValidationSchema(registerSchema)}
  >
    {
      ({handleChange,values,setFieldValue,errors,handleSubmit,touched,handleBlur,isSubmitting,})=>{
        return (
        <View className="flex-1  flex-col justify-center  mx-4  " >
          {/* Form InPUT   */}
          <View className="flex-1">
            <ScrollView  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="flex-1 flex flex-col mb-2 ">
              <Input id={"name"} value={values.name} handleChange={handleChange} handleBlur={handleBlur} touched={touched.name} error={errors.name}  /> 
              <Input id={"email"} value={values.email} handleChange={handleChange} handleBlur={handleBlur} touched={touched.email} error={errors.email}  /> 
              <Input id={"address"} value={values.address} handleChange={handleChange} handleBlur={handleBlur} touched={touched.address} error={errors.address}  /> 
              {/* <Input id={"phone_number"} label="phone number" value={values.phone_number} handleChange={handleChange} handleBlur={handleBlur} touched={touched.phone_number} error={errors.phone_number}  />  */}
              <PhoneInput ref={phoneRef} className="border-[1px] border-white rounded-lg px-4 py-3 " /> 
              <Input id={"password"} password value={values.password} handleChange={handleChange} handleBlur={handleBlur} touched={touched.password} error={errors.password}  /> 
              <Input id={"confirmPassword"} label="confirm password" password value={values.confirmPassword} handleChange={handleChange} handleBlur={handleBlur} touched={touched.confirmPassword} error={errors.confirmPassword}  /> 
            </ScrollView>
            {/* Button */}
            <TouchableOpacity onPress={handleSubmit as ()=>void}>
              <View className="flex flex-col items-center w-full bg-gray-100  mb-4 py-2 px-2 rounded-lg ">
                <Text  style={uberFont} className="text-black font-bold text-xl ">{!isSubmitting?"Register":<ActivityIndicator color="black" />}</Text>
              </View>
              {/* register */}
              <View className='flex flex-row items-center justify-center gap-2 text-sm px-2 mb-2 '>
                <Text  style={uberFont} className="text-gray-500">Already have an account?</Text>
                <TouchableOpacity onPress={()=>{navigation.navigate("Auth",{screen:"login"})}} className="underline cursor-pointer ml-2">
                  <Text style={uberFont} className="text-gray-100 ">Sign In  </Text>
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

export default RegisterForm;