import {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {authenticateUser} from "../controllers/authController";
import {upload} from "../utils/multer";
import {addNewSong, validateAccessType} from "../controllers/songsController";
import {ResponseError} from "../utils/response";

export const router: Router = Router()

router.route('/')
    .post(logInvokedEndpoint, validateAccessType, authenticateUser, upload.single('file'),
        async (req: Request, res: Response, next: NextFunction) => {
            const file: Express.Multer.File = req.file as Express.Multer.File
            if (!file) {
                throw new ResponseError(400, 'no file found')
            }
            const accessType: string = req.query.access as string
            const userData = res.locals.user
            await addNewSong(accessType, file, userData.id)

            res.status(201).json()
        })