import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const owner = req.user
    console.log("content: ", content)
    console.log("owner: ", owner)

    if(!content && !owner){
        throw new ApiError(400, "All fields are required")
    }

    const tweet = await Tweet.create({
        content,
        owner
    })

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400, "userId not get")
    }
    
    const tweets = await Tweet.find({owner: userId})
    

    console.log("tweets", tweets)

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const {content} = req.body
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400, "Please provide tweet id")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "tweet not found")
    }

    if(tweet.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    const tweetUpdated = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, tweetUpdated, "Tweet update successfully."))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400, "Please provide tweet id")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "tweet not found")
    }

    if(tweet.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)


    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
