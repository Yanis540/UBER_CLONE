import { Formik } from 'formik';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import {z} from "zod"
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useAddComment } from '../../../../hooks/comments';
import Input from '../../../Input/Input';
import { TextInput } from 'react-native-gesture-handler';
import { uberFont } from '../../../../styles';
interface CommentFormProps {
    driverId : string 
};

const commentSchema = z.object({
    text:z.string().min(1).optional()
})
type CommentSchema = z.infer<typeof commentSchema >

function CommentForm({driverId}:CommentFormProps) {
    const {commentAsync} = useAddComment(driverId)
    return (
    <Formik<CommentSchema>
        initialValues={{text: ""}}
        onSubmit={async(values:CommentSchema,actions:any) => {
            try{

                if(commentSchema.safeParse(values).success==false)
                    return ; 
                    await commentAsync(values as {text:string} )
                actions.resetForm()
            }
            catch(err){

            }
        }}
        validationSchema={toFormikValidationSchema(commentSchema)}
    >
    {
        ({handleChange,values,setFieldValue,errors,handleSubmit,touched,handleBlur,isSubmitting,})=>{
            return (

            <View className='flex flex-row items-center border border-gray-300  py-3 px-3'>
                <ScrollView className="flex-1 rounded-lg py-1 px-1 mr-2 ">
                    <TextInput
                        selectionColor={"rgb(156 163 175)"} placeholderTextColor="rgb(156 163 175)" 
                        className={` text-gray-400 border-[1px] p-2 rounded-lg ${(!touched.text || !errors.text)?"border-gray-100":"border-red-500"}  `}
                        onChangeText={handleChange("text")}onBlur={handleBlur("text")}
                        placeholder={"Comment"}
                        value={values.text} style={uberFont}
                    /> 
                </ScrollView>

                <View className="py-2 px-3 bg-black rounded-lg " >
                    <TouchableOpacity onPress={handleSubmit as ()=>void}>
                    <Text className='text-white'>{!isSubmitting?"Comment":<ActivityIndicator color="white" />}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )
        }
    }
    </Formik>
    );
};

export default CommentForm;