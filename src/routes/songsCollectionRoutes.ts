import express, {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {AccessType, ContentType, SongsCollection} from "@prisma/client";
import {
    addSongsCollection,
    addSongToPlaylist,
    deleteSongsCollection,
    getSongsCollectionDataById,
    getSongsCollectionsData,
    getSongsCollectionsDataFromCreator,
    removeSongFromPlaylist,
    setSongsCollectionAccessType,
    updateSongsCollection
} from "../controllers/songsCollectionController";
import {responseOk} from "../utils/response";
import {authenticateUser} from "../controllers/authController";
import {getUserIdByName} from "../controllers/userController";
import {checkIdsNumeric, isIdNumeric} from "../utils/isIdNumeric";
import {validateAccessType} from "../controllers/songsController";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        const collectionType = req.query.type as string
        try {
            const data: SongsCollection[] = await getSongsCollectionsData(collectionType)
            if (data.length == 0) {
                res.status(204)
            } else {
                res.status(200)
            }
            res.json(responseOk(res.locals.user, data))
        } catch (e) {
            next(e)
        }
    })
    .post(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        const userData = res.locals.user
        try {
            const addedCollection = await addSongsCollection(req.body, userData.id)
            res.status(201).json(responseOk(userData, addedCollection))
        } catch (e) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const updatedCollection = await updateSongsCollection(req.body, userData.id)
            res.status(200).json(responseOk(userData, updatedCollection))
        } catch (e) {
            next(e)
        }
    })

router.route('/:id')
    .get(logInvokedEndpoint, isIdNumeric, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collectionId = BigInt(req.params.id)
            const data: SongsCollection | null = await getSongsCollectionDataById(collectionId)
            if (!data) {
                res.status(204)
            } else {
                res.status(200)
            }
            res.json(responseOk(res.locals.user, data))
        } catch (e) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, isIdNumeric, validateAccessType, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        const userData = res.locals.user
        const songId = BigInt(req.params.id)
        const accessType: AccessType = req.query.access as AccessType
        try {
            const updatedSong: SongsCollection = await setSongsCollectionAccessType(songId, accessType, userData.id)
            res.status(200).json(responseOk(userData, updatedSong))
        } catch (e) {
            next(e)
        }
    })
    .delete(logInvokedEndpoint, authenticateUser, isIdNumeric, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collectionId = BigInt(req.params.id)
            const userData = res.locals.user
            await deleteSongsCollection(collectionId, userData.id)
            res.status(200).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })

router.route('/:playlistId/song/:songId')
    .post(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIdsNumeric(req.params.songId, req.params.playlistId)
            const songId = BigInt(req.params.songId)
            const playlistId = BigInt(req.params.playlistId)
            const userData = res.locals.user

            await addSongToPlaylist(songId, playlistId, userData.id)
            res.status(200).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIdsNumeric(req.params.songId, req.params.playlistId)
            const songId = BigInt(req.params.songId)
            const playlistId = BigInt(req.params.playlistId)
            const userData = res.locals.user

            await removeSongFromPlaylist(songId, playlistId, userData.id)
            res.status(200).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })

router.route('/users/:username')
    .get(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: bigint = await getUserIdByName(req.params.username)
            const data: SongsCollection[] = await getSongsCollectionsDataFromCreator(userId, ContentType.PLAYLIST)
            if (data.length == 0) {
                res.status(204)
            } else {
                res.status(200)
            }
            res.json(responseOk(res.locals.user, data))
        } catch (e) {
            next(e)
        }
    })

router.route('/owner/jwt')
    .get(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const data: SongsCollection[] = await getSongsCollectionsDataFromCreator(userData.id, ContentType.PLAYLIST)
            if (data.length == 0) {
                res.status(204)
            } else {
                res.status(200)
            }
            res.json(responseOk(userData, data))
        } catch (e) {
            next(e)
        }
    })