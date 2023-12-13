import { db } from "../../../libs/db";
import {Response , Request} from "express"
import { generateAuthToken } from "../../../tokens";
import { errorHandler } from "../../../util";
import {z} from "zod"
import { CommentError } from "../types";
import { includeComment } from "../../Ride/types";
import { push } from "../../../libs/expo";


const getDriverComments = z.object({
    driverId:z.string()
})
const indexSchema = z.number().min(0)
const queryDriverComments = z.object({
    // index:z.number().min(0)
    index:z.union([indexSchema,z.preprocess(
        // query params are passed as string that's why we use this 
        (num)=>parseInt(z.string().parse(num),10),
        indexSchema
    )])
})
interface GetDriverCommentsRequest extends Request{
    params:z.infer<typeof getDriverComments>, 
    
}

const get_driver_comments = async(req:GetDriverCommentsRequest,res:Response)=>{
    try{
        const page_size = 10
        const {driverId} = getDriverComments.parse(req.params); 
        const {index} = queryDriverComments.parse(req.query)
        const driver_user = await db.driver.findFirst({
            where:{licence_id:driverId}, 
        }); 
        if(!driver_user){
            res.status(404); 
            throw new Error("Driver Not Found",{cause: CommentError.DRIVER_NOT_FOUND})
        }
        const comments = await db.comment.findMany({
            where:{
                driver:{
                    licence_id:driverId
                }
            }, 
            skip:index, 
            take:page_size,
            orderBy:[{"commented_at":"desc"}],
            include:includeComment(driverId,req.user!?.id)
        }) 
        const number_page_comments= comments.length
        res.status(201).json({comments,next : number_page_comments==10,number_page_comments,page_size:page_size})
    }
    catch(err:any){
        console.log(err.message,"GET_DRIVER_COMMENTS")
        errorHandler(err,res)
    }
}

const commentDriverBodySchema = z.object({
    text : z.string().min(1), 
})


interface CommentDriverRequest extends Request{
    body:z.infer<typeof commentDriverBodySchema>, 
    params:{
        driverId:string 
    }
}

const comment_on_driver = async(req:CommentDriverRequest,res:Response)=>{
    try{
        const schema = commentDriverBodySchema.parse(req.body);
        const {driverId} = req.params 

        if(driverId == req.user!.id){
            res.status(403)
            throw new Error("You can't comment on yourself ",{cause:CommentError.DRIVER_IS_SAME_TO_COMMENT})
        }
        const driver_user = await db.user.findFirst({
            where:{id:driverId}, 
            include:{
                driver:{
                    include:{
                        _count:{
                            // counting the driver's comment's 
                            select:{
                                comments:true 
                            }
                        }
                    }, 
                },
                push_tokens:{
                    select:{
                        token:true
                    }
                }
            }
        }); 
        if(!driver_user || driver_user.role!="DRIVER"){
            res.status(404); 
            throw new Error("Driver Not Found",{cause: CommentError.DRIVER_NOT_FOUND})
        }
        // if user didn't ride with driver 
        const userRideWithDriver = await db.ride.findFirst({
            where:{
                user:{
                    id:req.user!?.id , 
                }, 
                driver:{
                    licence_id:driverId
                }, 
                ride_status:{
                    in:["finished","cancelled"]
                }
            }
        });
        if(!userRideWithDriver){
            res.status(403)
            throw new Error(`Can't comment on Driver if you did not ride with him`,{cause:CommentError.USER_DID_NOT_RIDE_WITH_DRIVER})
        }
        const comment = await db.comment.create({
            data:{
                text:schema.text , 
                user:{
                    connect:{
                        id:req.user!?.id 
                    }
                }, 
                driver:{
                    connect:{
                        licence_id:driverId,
                    }, 
                }
            },
            include:includeComment(driverId,req.user!?.id)
        }); 
        // update the user 
        const updated_user = await db.user.update({
            where:{id:req.user!.id},
            data:{
                drivers_commented_on:{
                    connect:{
                        licence_id: driverId
                    }
                }
            }
        })

        // send push notification 
        await push.sendPushNotifications([
            {
                to:driver_user.push_tokens.map(token=>token.token)!,
                options:{
                    title:`${updated_user.name} commented`, 
                    body:`${updated_user.name} commented`, 
                    data:{
                        event:"comment", 
                        body:{

                        }
                    }
                } 
            }
        ])
        res.status(201).json({message:"Thank you for your comment ",comment})
    }
    catch(err:any){
        console.log(err.message,"COMMENT_DRIVER")
        errorHandler(err,res)
    }

}


const deleteCommentDriverParamsSchema = z.object({id:z.string()}) 
interface DeleteCommentDriverRequest extends Request{
    params:z.infer<typeof deleteCommentDriverParamsSchema>
}

const delete_comment_on_driver = async(req:DeleteCommentDriverRequest, res:Response)=>{
    try{
        const {id} = deleteCommentDriverParamsSchema.parse(req.params) ; 
        // search for comment  
        const comment = await db.comment.findFirst({
            where:{
                id:id, 
                user : {
                    id:req.user!?.id
                }
            }, 
            
        }); 
        if(!comment){
            res.status(404); 
            throw new Error("Comment Not Found ",{cause: CommentError.COMMENT_NOT_FOUND})
        }
        const deleted_comment = await db.comment.delete({
            where:{
                id
            }, 
        }); 
        res.status(201).json({message:"Comment deleted",comment})
    }
    catch(err:any){
        console.log(err.message,"DELETE_COMMENT")
        errorHandler(err,res)
    }
}
const likedCommentParamsSchema = z.object({id:z.string()}) 
interface LikeCommentRequest extends Request{
    params:z.infer<typeof likedCommentParamsSchema>
}

const like_comment = async(req:LikeCommentRequest, res:Response)=>{
    try{
        const {id} = likedCommentParamsSchema.parse(req.params) ; 
        // search for comment  
        const updated_comment = await db.comment.update({
            where:{
                id:id, 
            }, 
            data:{
                liked_by:{
                    connect:{
                        id:req.user!?.id
                    }
                }
            },
            include:{
                user:{
                    include:{
                        push_tokens:{
                            select:{
                                token:true
                            }
                        }
                    }
                }, 
                driver:{
                    include:{
                        user:true
                    }
                }
            } 
            
        });

        if(!updated_comment){
            res.status(404); 
            throw new Error("Comment Not Found ",{cause: CommentError.COMMENT_NOT_FOUND})
        }
        const comment = await db.comment.findFirst({
            where:{id}, 
            include:includeComment(updated_comment?.licence_id,req.user!.id), 
        }); 
        const commentedUserPushTokens = updated_comment.user.push_tokens.map((token)=>token.token); 
        if(updated_comment.user_id != req.user?.id){
            await push.sendPushNotifications([
                {
                    to:commentedUserPushTokens,
                    options:{
                        title:`${updated_comment.user.name} liked your comment on ${updated_comment.driver?.user?.name}`, 
                        body:`${updated_comment.user.name} liked your comment on ${updated_comment.driver?.user?.name}`, 
                        data:{
                            event:"comment", 
                            body:{
    
                            }
                        }
                    } 
                }
            ])
        }

        res.status(201).json({message:"Comment liked",comment})
    }
    catch(err:any){
        console.log(err.message,"LIKED_COMMENT")
        errorHandler(err,res)
    }
}
const unlike_comment = async(req:LikeCommentRequest, res:Response)=>{
    try{
        const {id} = likedCommentParamsSchema.parse(req.params) ; 
        // search for comment  
        const updated_comment = await db.comment.update({
            where:{
                id:id, 
            }, 
            data:{
                liked_by:{
                    disconnect:{
                        id:req.user!?.id
                    }
                }
            },
            
        });

        if(!updated_comment){
            res.status(404); 
            throw new Error("Comment Not Found ",{cause: CommentError.COMMENT_NOT_FOUND})
        }
        const comment = await db.comment.findFirst({
            where:{id}, 
            include:includeComment(updated_comment?.licence_id,req.user!.id)
        })
        res.status(201).json({message:"Comment unliked",comment})
    }
    catch(err:any){
        console.log(err.message,"UNLIKED_COMMENT")
        errorHandler(err,res)
    }
}

export {
    get_driver_comments, 
    comment_on_driver, 
    delete_comment_on_driver, 
    like_comment, 
    unlike_comment
}