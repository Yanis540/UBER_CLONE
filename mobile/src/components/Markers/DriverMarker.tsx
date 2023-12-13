import { View, Image , } from 'react-native'
function DriverMarker({driver}:{driver:Driver}){

    return (
    <View className="flex flex-col h-[32px] w-[32px] p-[3px] bg-emerald-300 rounded-full  ">
        <Image source={{uri: driver.user.photo!}} className="w-full h-full rounded-full" /> 
    </View>
    )
}
export default DriverMarker