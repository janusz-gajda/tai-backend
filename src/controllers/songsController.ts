import {AccessType, Prisma, Song} from "@prisma/client";
import {ResponseError} from "../utils/response";
import mm from "music-metadata";
import {addSong, deleteSongById, findSongById, songExists} from "../repositories/songsRepository";
import {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import {
    addSongToSongsCollection,
    createAlbumIfNotExists,
    findAlbumWithSongsByName
} from "../repositories/songsCollectionRepository";

export async function addNewSong(accessType: string, file: Express.Multer.File, addingUserId: bigint) {
    const songMetadata = await mm.parseFile(file.path)
    const common = songMetadata.common

    if (await songExists(common.title as string, common.artist as string, addingUserId)) {
        fs.rmSync(file.path)
        throw new ResponseError(409, `song with title \"${common.title}\" already exists`)
    }

    const addedSongData: Prisma.SongCreateInput = {
        title: common.title as string,
        author: common.artist as string,
        access: accessType as AccessType,
        addingUser: {
            connect: {id: addingUserId}
        }
    }

    const createdSong: Song = await addSong(addedSongData)
    const newPath = getSongPath(createdSong.id)
    try {
        moveFile(file, newPath)
    } catch (e) {
        await deleteSongById(createdSong.id)
        throw new ResponseError(400, 'file could not be saved')
    }

    if (common.album && accessType === AccessType.PUBLIC) {
        await updateAlbum(createdSong, common.album)
    }

    return createdSong
}

export async function deleteSong(songId: bigint, addingUserId: bigint) {
    const songToDelete = await findSongById(songId)
    if (!songToDelete) {
        throw new ResponseError(404, 'song not found')
    }
    if (songToDelete.addingUserId != addingUserId) {
        throw new ResponseError(400, `song does not belong to user`)
    }

    fs.rmSync(getSongPath(songId), {recursive: true})
    await deleteSongById(songId)
}

export const validateAccessType = (req: Request, res: Response, next: NextFunction) => {
    const accessType = req.query.access as string
    if (accessType !== AccessType.PRIVATE && accessType !== AccessType.PUBLIC) {
        throw new ResponseError(400, 'invalid song\'s access type')
    }
    next()
}

async function updateAlbum(song: Song, albumName: string) {
    const album = await findAlbumWithSongsByName(albumName)
    if (!album) {
        return await createAlbumIfNotExists(song, albumName)
    }
    if (!album.songs.some(s => s.title.toLowerCase().includes(song.title.toLowerCase()))) {
        return await addSongToSongsCollection(song.id, album.id)
    }
}

function moveFile(file: Express.Multer.File, newFilePath: string) {
    if (!fs.existsSync(newFilePath)) {
        fs.mkdirSync(newFilePath)
    }
    fs.renameSync(file.path, newFilePath.concat('/', file.originalname))
}

function getSongPath(songId: bigint) {
    const basePath = process.env.SONGS_PATH as string
    return basePath.concat(`/${songId}`)
}
