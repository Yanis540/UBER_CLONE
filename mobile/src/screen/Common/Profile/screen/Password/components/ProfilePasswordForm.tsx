import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native'
import { uberFont } from '../../../../../../styles';
import { Formik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { InputError } from '../../../../../../components/Input/Input';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
const profileDetailsSchema = z.object({
    old_password : z.string().min(4).optional(), 
    new_password: z.string().min(4).optional(),
    confirmPassword : z.string().min(4).optional()
})
.refine((data) => data.new_password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
})
type ProfilePasswordSchema = z.infer<typeof profileDetailsSchema>

interface ProfileDetailsFormProps {
    onSubmit: (data: ProfilePasswordSchema) => Promise<void>
};

function ProfilePasswordForm({onSubmit}:ProfileDetailsFormProps) {
    return (
    <Formik<ProfilePasswordSchema>
        initialValues={{old_password: "",confirmPassword:"",new_password:""}}
        onSubmit={async(values:ProfilePasswordSchema,actions:any) => {
            const old_password=  values.old_password?.trim()!=""?values.old_password:undefined
            const new_password=  values.new_password?.trim()!=""?values.new_password:undefined
            const confirmPassword=  values.confirmPassword?.trim()!=""?values.confirmPassword:undefined
            await onSubmit({old_password,confirmPassword,new_password})
                .then(()=>actions.resetForm({}))
                .catch((err)=>{console.log(err)}) 
        }
    }
        validationSchema={toFormikValidationSchema(profileDetailsSchema)}
    >
    {
      ({handleChange,values,setFieldValue,errors,handleSubmit,touched,handleBlur,isSubmitting,})=>{
        return (
        <View className="flex-1  flex-col   mx-4  " >
          {/* Form InPUT   */}
          <View className="flex-1 ">
            <ScrollView   className=" flex flex-col my-2  ">
              {/** Email */}
             
                <View className="flex flex-col py-3 mb-2 ">
                    <TextInput
                        selectionColor={"rgb(156 163 175)"} placeholderTextColor="rgb(156 163 175)" 
                        className={` text-black border-[1px] p-2 mb-2 rounded-lg ${(!touched.old_password || !errors.old_password)?"border-gray-300":"border-red-500"}  `}
                        onChangeText={handleChange("old_password")} onBlur={handleBlur("old_password")}
                        placeholder={"Old Password"}  secureTextEntry={true}
                        value={values.old_password} style={uberFont}
                    />
                    <InputError error={errors.old_password} touched={touched.old_password} />  
                </View>
                <View className="flex flex-col py-3 mb-2 ">
                    <TextInput
                        selectionColor={"rgb(156 163 175)"} placeholderTextColor="rgb(156 163 175)" 
                        className={` text-black border-[1px] p-2 mb-2 rounded-lg ${(!touched.new_password || !errors.new_password)?"border-gray-300":"border-red-500"}  `}
                        onChangeText={handleChange("new_password")} onBlur={handleBlur("new_password")}
                        placeholder={"New Password"}  secureTextEntry={true}
                        value={values.new_password} style={uberFont}
                    /> 
                    <InputError error={errors.new_password} touched={touched.new_password} />  
                
                </View>
                <View className="flex flex-col py-3 mb-2 ">
                    <TextInput
                        selectionColor={"rgb(156 163 175)"} placeholderTextColor="rgb(156 163 175)" 
                        className={` text-black border-[1px] p-2 mb-2 rounded-lg ${(!touched.confirmPassword || !errors.confirmPassword)?"border-gray-300":"border-red-500"}  `}
                        onChangeText={handleChange("confirmPassword")} onBlur={handleBlur("confirmPassword")}
                        placeholder={"Confirm Password"}  secureTextEntry={true}
                        value={values.confirmPassword} style={uberFont}
                    /> 
                    <InputError error={errors.confirmPassword} touched={touched.confirmPassword} />  
                </View>
               
            </ScrollView>
            {/* Button */}
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




export default ProfilePasswordForm;