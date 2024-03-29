import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(400, "video not found.")
    }

    const comment = await Comment.find({video: videoId})
    .limit(limit*1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })

    const count = await Comment.countDocuments({
        $where: {
            video: videoId
        }
    })

    return res
    .status(200)
    .json(400, {
        comment,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    })
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {videoId} = req.params
    const {content} = req.body
    const user = req.user

    if(!videoId){
        throw new ApiError(400, "video not found")
    }

    const comment = await Comment.create(
        {
            content: content,
            video: videoId,
            owner: user
        }
    )

    return res
    .status(200)
    .json(200, comment, "Comment added.")
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // myTodo: add check for authorization. in delete and other model also.

    const {commentId} = req.params
    const {content} = req.body

    if(!commentId){
        throw new ApiError(400, "Please provide comment id.")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "comment not found.")
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized access, you can't update this comment.")
    }

    const commentUpdated = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, commentUpdated, "comment updated."))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(404, "Please provide comment id.")
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized access, you can't delete this comment.")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "comment not found.")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "commrnt deleted."))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
