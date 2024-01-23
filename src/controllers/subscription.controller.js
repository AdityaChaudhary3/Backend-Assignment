import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const user = req.user
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)) {    
        throw new ApiError(400, "Invalid channel id")
    }

    const list = await Subscription.findOne({channel: channelId, subscriber: user._id})

    if(list){
        console.log("list", list)
        const subscription = await Subscription.findByIdAndDelete(list._id)

        return res
        .status(200)
        .json(new ApiResponse(200, subscription, "Subscription removed"))
    }

    const subscription = await Subscription.create(
        {
            channel: channelId,
            subscriber: user
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Subscription added"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscriber = await Subscription.find({channel: channelId})

    return res
    .status(200)
    .json(new ApiResponse(200, subscriber, "Subscriber list fetched"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const channel = await Subscription.find({subscriber: subscriberId})

    return res
    .status(200)
    .json(new ApiResponse(200, channel, "Channel list fetched"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}