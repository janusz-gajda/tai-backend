import multer from 'multer'
import {Request} from "express";
import {ResponseError} from "./response";

const acceptedFileTypes = [
    'audio/mpeg',
    'audio/ogg',
    'audio/opus',
    'audio/aac',
    'audio/matroska',
    'audio/flac',
    'audio/x-flac'
]

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './songs/tmp')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (!acceptedFileTypes.includes(file.mimetype)) {
        callback(new ResponseError(415, 'invalid file type'))
    } else {
        callback(null, true)
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})