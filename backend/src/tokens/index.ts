import jwt from "jsonwebtoken";
/**
* @param id  : string
* @return object : {accessToken,expiresIn}
* @return expiresIn : in ms
* @return accessToken : access token
* 
*/
const generateAccessToken=(id:string)=>{
    return {
        accessToken:jwt.sign(
            {id},
            process.env.ACCESS_TOKEN_SECRET!,{
             expiresIn:'60d'
            }
        ),
        expiresIn:Date.now() + 600*1000
    }
}

/**
* @param id 
* @return  refreshToken
* 
*/
const generateRefreshToken=(id:string)=>{
    return jwt.sign({id},process.env.REFRESH_TOKEN_SECRET!,{expiresIn:'7d'})
}

/**
* @param id 
* @return object : {accessToken,expiresIn,refreshToken}
* @return expiresIn : expire date of the accessToken in ms
* @return accessToken : access token
* @return refreshToken : refresh token
* 
*/
const generateAuthToken=(id:string)=>{
    let accessElement=generateAccessToken(id)
    let refreshToken=generateRefreshToken(id)
    return{
        accessToken:accessElement.accessToken,
        expiresIn:accessElement.expiresIn,
        refreshToken
    }
}


export {
    generateAuthToken,
    generateRefreshToken,
    generateAccessToken,
}