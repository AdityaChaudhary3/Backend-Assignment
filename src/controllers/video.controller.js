import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    const videoLocalPath = req.files?.videoFile[0]?.path

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "video file and thumbnail are required.")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnail){
        throw new ApiError(500, "Error uploading video file or thumbnail.")
    }

    // console.log("video response",videoFile)

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user._id
    })


    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video created successfully."))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!videoId){
        throw new ApiError(400, "video not found.")
    }

    const video = await Video.findByIdAndUpdated(videoId, {
        $inc: {
            views: 1
        }
    })

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video retrieved successfully."))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    // myTodo: handle thumbnail.

    if(!videoId){
        throw new ApiError(400, "video not found.")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: req.body?.title,
                description: req.body?.description,
                // thumbnail: req.body?.thumbnail
            }
        }
        
    )

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully."))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    //myTodo: delete video from cloudinary and delete comments and likes associated with the video

    if(!videoId){
        throw new ApiError(400, "video not found.")
    }

    await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(200, {}, "Video deleted.")
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "video not found.")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        [
            {
                $set: {
                    isPublished: {
                    $eq: [false, "$isPublished"]
                    }
                }
            }
        ]
    )

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Toggle video status successfully."))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
