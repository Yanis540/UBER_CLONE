import { db } from "../../db"

export const getUsersPushTokens = async({user_ids}:{user_ids:string|string[]})=>{
    const users = (await db.user.findMany({
        where:{
            id:{
                in:(typeof user_ids == "string")?[user_ids]:user_ids
            }
        }, 
        include:{
            push_tokens:{
                select: {
                    token:true
                }
            }
        }
    }))
    const push_tokens = users.reduce((acc,user)=>[...acc,...(user.push_tokens.map(token=>token.token))],([] as string[])) 
    return push_tokens
}