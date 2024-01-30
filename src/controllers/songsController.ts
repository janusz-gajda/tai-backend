import {AccessType, ContentType, Prisma, Song, User} from "@prisma/client";
import {ResponseError} from "../utils/response";
import mm from "music-metadata";
import {addSong} from "../repositories/songsRepository";
import {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import {addSongToExistingAlbumOrCreateNewAlbum} from "../repositories/songsCollectionRepository";

export async function addNewSong(accessType: string, file: Express.Multer.File, addingUserId: bigint) {
    const songMetadata = await mm.parseFile(file.path)
    const common = songMetadata.common

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

    if (common.album) {
        await addSongToExistingAlbumOrCreateNewAlbum(createdSong, common.album)
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

function addSongToAlbum() {

}

function moveFile(file: Express.Multer.File, newFilePath: string) {
    if (!fs.existsSync(newFilePath)) {
        fs.mkdirSync(newFilePath)
    }
    fs.renameSync(file.path, newFilePath.concat('/', file.originalname))
}