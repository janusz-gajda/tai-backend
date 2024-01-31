import {AccessType, Prisma, Song} from "@prisma/client";
import {ResponseError} from "../utils/response";
import mm from "music-metadata";
import {addSong, songExists} from "../repositories/songsRepository";
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
        throw new ResponseError(409, `song with title ${common.title} already exists`)
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
    const newPath = `./songs/${createdSong.id}`
    moveFile(file, newPath)

    if (common.album && accessType === AccessType.PUBLIC) {
        await updateAlbum(createdSong, common.album)
    }

    return createdSong
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
        return await addSongToSongsCollection(song, album.id)
    }
}

function moveFile(file: Express.Multer.File, newFilePath: string) {
    if (!fs.existsSync(newFilePath)) {
        fs.mkdirSync(newFilePath)
    }
    fs.renameSync(file.path, newFilePath.concat('/', file.originalname))
}
