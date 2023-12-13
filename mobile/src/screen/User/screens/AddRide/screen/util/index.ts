export const calculate_total_ride = ({distance,price_per_km,additionnal,traffic_coef}:{distance:number,price_per_km:number,additionnal:number,traffic_coef:number})=>{
    return +((distance*price_per_km + additionnal)*(traffic_coef)).toFixed(2)
}