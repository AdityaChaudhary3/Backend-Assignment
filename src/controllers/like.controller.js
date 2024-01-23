import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const user = req.user
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const list = await Like.findOne({video: videoId, likedBy: user._id})

    if(list){
        const like = await Like.findByIdAndDelete(list._id)

        return res
        .status(200)
        .json(new ApiResponse(200, like, "Like removed"))
    }

    const like = await Like.create(
        {
            video: videoId,
            likedBy: user
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, like, "Like added"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const user = req.user
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const list = await Like.findOne({comment: commentId, likedBy: user._id})

    if(list){
        const like = await Like.findByIdAndDelete(list._id)

        return res
        .status(200)
        .json(new ApiResponse(200, like, "Like removed"))
    }

    const like = await Like.create(
        {
            comment: commentId,
            likedBy: user
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, like, "Like added"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const user = req.user
    //TODO: toggle like on tweet

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const list = await Like.findOne({tweet: tweetId, likedBy: user._id})

    if(list){
        const like = await Like.findByIdAndDelete(list._id)

        return res
        .status(200)
        .json(new ApiResponse(200, like, "Like removed"))
    }

    const like = await Like.create(
        {
            tweet: tweetId,
            likedBy: user
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, like, "Like added"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const user = req.user

    if(!user){
        throw new ApiError(400, "User not found")
    
    }

    const videos = await Like.find(
        {
            likedBy: user._id,
            video: {$exists: true}
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}