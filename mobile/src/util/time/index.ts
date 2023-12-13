import moment from "moment"

export const getTime = (time : string|Date)=>{
    const number_units_time = moment(time).fromNow().split(" ")[0] 
    const unit_time = moment(time).fromNow().split(" ")[1].split(" ")[0] 
    return {
        number_units_time, 
        unit_time
    }
}