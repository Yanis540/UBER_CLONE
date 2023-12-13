import React, {useRef} from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native'
import { statusBarMargin, uberFont } from '../../../../../../styles';
import { Formik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Input, { InputError } from '../../../../../../components/Input/Input';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import validator from "validator";
import { useAuth } from '../../../../../../context/store';
import { useToast } from 'react-native-toast-notifications';
import { phoneNumberSchema, validatePhoneNumber } from '../../../../../../util/phone';
import PhoneInput from '../../../../../../components/Input/PhoneInput';
const profileDetailsSchema = z.object({
  address : z.string().optional(), 
  phone_number: phoneNumberSchema,
  name : z.string().min(4).optional()
})
type ProfileDetailsSchema = z.infer<typeof profileDetailsSchema>

interface ProfileDetailsFormProps {
  onSubmit: (data: ProfileDetailsSchema) => Promise<any|void>
};

function ProfileDetailsForm({onSubmit}:ProfileDetailsFormProps) {
  const {user} = useAuth(); 
  const toast = useToast(); 
  const phoneRef = useRef<any | undefined>(undefined)
  const handleSubmit = async(values:ProfileDetailsSchema,actions:any) => {
    const address=  values.address?.trim()!=""?values.address:undefined
    const name=  values.name?.trim()!=""?values.name:undefined
    const phone_number = validatePhoneNumber(phoneRef?.current?._reactInternals?.memoizedState?.value); 
    if(!phone_number){
      return toast.show("Invalid phone number",{type:"danger"})
    }
    await onSubmit({address,name,phone_number})
      .then(()=>actions.resetForm({}))
      .catch((err)=>{console.log(err)})
    ;  
  }
  return (
  <Formik<ProfileDetailsSchema>
    initialValues={{address: "",name:"",phone_number:""}}
    onSubmit={handleSubmit}
    validationSchema={toFormikValidationSchema(profileDetailsSchema)}
  >
  {
    ({handleChange,values,errors,handleSubmit,touched,handleBlur,isSubmitting,})=>{
      return (
      <View className="flex-1  flex-col   mx-4  " >
        {/* Form InPUT   */}
        <View className="flex-1 ">
          <ScrollView   className=" flex flex-col my-2  ">
            {/** Email */}
            <View className="flex flex-col py-3 mb-2 ">
              <TextInput
                selectionColor={"rgb(156 163 175)"} placeholderTextColor="rgb(156 163 175)" 
                className={` text-black border-[1px] p-2 mb-2 rounded-lg ${(!touched.name || !errors.name)?"border-gray-300":"border-red-500"}  `}
                onChangeText={handleChange("name")} onBlur={handleBlur("name")}
                placeholder={"Name"}
                value={values.name} style={uberFont}
              /> 
              <InputError error={errors.name} touched={touched.name} />  
            </View>
            <View className="flex flex-col py-3 mb-2 ">
              <TextInput
                selectionColor={"rgb(156 163 175)"} placeholderTextColor="rgb(156 163 175)" 
                className={` text-black border-[1px] p-2 mb-2 rounded-lg ${(!touched.address || !errors.address)?"border-gray-300":"border-red-500"}  `}
                onChangeText={handleChange("address")} onBlur={handleBlur("address")}
                placeholder={"Address"}
                value={values.address} style={uberFont}
              /> 
              <InputError error={errors.address} touched={touched.address} />  
            </View>
            <View className="flex flex-col py-3 mb-2 ">
              <PhoneInput ref={phoneRef} initialValue={user?.phone_number} /> 
            </View>
          </ScrollView>
          <TouchableOpacity   onPress={handleSubmit as ()=>void}>
            <View className="flex flex-col items-center justify-center w-full bg-black   mb-4 py-1 px-1 rounded-lg ">
              <Text style={uberFont} className="text-white font-semibold text-xl ">{!isSubmitting?"Update":<ActivityIndicator color="white" />}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )}
  } 

</Formik>
  );
};




export default ProfileDetailsForm;