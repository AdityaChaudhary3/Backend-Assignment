import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const channelId = req.user._id

    const totalSubscribers = await Subscription.countDocuments([{
        $where: {channel: channelId
        }
    }])
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const channelId = req.user?._id

    if(!channelId){
        throw new ApiError(400, "Invalid channel id")
    }

    const videos = await Video.find({channel: channelId})

    return res
    .status(200)
    .json(new ApiResponse(200, {videos}, "get all channel videos"))

})

export {
    getChannelStats, 
    getChannelVideos
    }