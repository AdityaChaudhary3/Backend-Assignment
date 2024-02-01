import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const user = req.user
    //TODO: create playlist

    if (!name || !description) {
        throw new ApiError(400, "Please provide name and description")
    }

    const playlist = await Playlist.create({
        name, 
        description, 
        owner: user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!userId){
        throw new ApiError(400, "Please provide user id")
    }

    const playlists = await Playlist.find({
        owner: userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists retrieved successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!playlistId){
        throw new ApiError(400, "Please provide playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist retrived successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400, "Playlist or video not found.")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400, "Playlist is not found.")
    }

    if(playlist.owner.toString() !== req?.user._id.toString()){
        throw new ApiError(403, "Unautharized accces, can't add video in playliist.")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Playlist retrived succesfully."))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!playlistId || !videoId){
        throw new ApiError("please provide video and playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400, "Playlist is not found.")
    }

    if(playlist.owner.toString() !== req?.user._id.toString()){
        throw new ApiError(403, "Unautharized accces, can't remove video from playliist.")
    }

    if(!playlist.video.includes(videoId)){
        throw new ApiError(400, "video not exists in this playlist. ");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                video: videoId
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(200, updatedPlaylist,"Video removed successfully." )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId){
        throw new ApiError(400, "Please provideo playlist id.")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400, "Playlist is not found.")
    }

    if(playlist.owner.toString() !== req?.user._id.toString()){
        throw new ApiError(403, "Unautharized accces, you can't delete playliist.")
    }
    
    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(200,{},"Playlist deleted. ")
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId){
        throw new ApiError(400, "Please provide the playlistId.")
    }

    if(!name || !description){
        throw new ApiError(400, "Please provide the field to update.")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description
            }
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist get updated."))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
