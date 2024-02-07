import {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {authenticateUser} from "../controllers/authController";
import {upload} from "../utils/multer";
import {addNewSong, deleteSong, setSongAccessType, validateAccessType} from "../controllers/songsController";
import {ResponseError, responseOk} from "../utils/response";
import {isIdNumeric} from "../utils/isIdNumeric";
import {AccessType} from "@prisma/client";
import {getUserPermissions} from "../controllers/userController";
import {checkIfUserHasPermission} from "../controllers/permissionController";
import {Permissions} from "../utils/permissions";

export const router: Router = Router()

router.route('/')
    .post(logInvokedEndpoint, validateAccessType, authenticateUser, getUserPermissions, upload.single('file'),
        async (req: Request, res: Response, next: NextFunction) => {
            const file: Express.Multer.File = req.file as Express.Multer.File
            if (!file) {
                throw new ResponseError(400, 'no file found')
            }
            const accessType: AccessType = req.query.access as AccessType
            const userData = res.locals.user
            try {
                checkIfUserHasPermission(res.locals.permissions, Permissions.MANAGE_SONGS)
                await addNewSong(accessType, file, userData.id)
                res.status(201).json(responseOk(userData))
            } catch (e) {
                next(e)
            }
        })

router.route('/:id')
    .put(logInvokedEndpoint, isIdNumeric, validateAccessType, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        const userData = res.locals.user
        const songId = BigInt(req.params.id)
        const accessType: AccessType = req.query.access as AccessType
        try {
            checkIfUserHasPermission(res.locals.permissions, Permissions.MANAGE_SONGS)
            const updatedSong = await setSongAccessType(songId, accessType, userData.id)
            res.status(200).json(responseOk(userData, updatedSong))
        } catch (e) {
            next(e)
        }
    })
    .delete(logInvokedEndpoint, isIdNumeric, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        const userData = res.locals.user
        const songId = BigInt(req.params.id)
        try {
            checkIfUserHasPermission(res.locals.permissions, Permissions.MANAGE_SONGS)
            await deleteSong(songId, userData.id)
            res.status(200).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })