import React from 'react';
import { Text, View } from 'react-native'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useDriverRating } from '../../hooks';
import { useDriverStore } from '../../context/store';
type Props = {
    type: "add" 
    rating : RatingSchema 
} | {
    type:"remove"
    rating ? : undefined
}
interface RatingComponentProps {
    driver : Driver
    rating ?: number 
    rate : ({rating,type}:Props)=>void 

};

function RatingComponent({driver,rating,rate}:RatingComponentProps) {
    return (
    <View className="flex flex-col  ">
        <Rating
            type='custom'
            ratingCount={5}
            startingValue={rating??0}
            imageSize={20}
            onFinishRating={(rating:number)=>rate({rating,type:"add"})}
        />
        <View className="flex flex-col items-end" >
            <Text className="text-[9px] text-golden-yellow">{driver?._count.ratings} {driver?._count.ratings == 0 || driver?._count.ratings == 1? "person":"persons"}</Text>
        </View>
    </View>
    );
};

export default RatingComponent;