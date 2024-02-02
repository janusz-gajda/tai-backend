import express, {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {findPlaylistsFromUser} from "../repositories/songsCollectionRepository";
import {SongsCollection} from "@prisma/client";
import {
    addSongsCollection,
    addSongToPlaylist,
    deleteSongsCollection,
    getSongsCollectionDataById,
    getSongsCollectionsData,
    getSongsCollectionsDataFromCreator,
    removeSongFromPlaylist,
    updateSongsCollection
} from "../controllers/songsCollectionController";
import {findUserByName} from "../repositories/userRepository";
import {ResponseError, responseOk} from "../utils/response";
import {authenticateUser} from "../controllers/authController";
import {checkIdsNumeric, isIdNumeric} from "../utils/isIdNumeric";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const collectionType = req.query.type as string
        const data: SongsCollection[] | null = await getSongsCollectionsData(collectionType)
        if (!data) {
            res.status(400).json({message: 'invalid collection type'})
            return
        }
        if (data.length == 0) {
            res.status(404).json()
            return
        }
        res.status(200).json(data)
    })
    .post(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        const userData = res.locals.user
        try {
            const addedCollection = await addSongsCollection(req.body, userData.id)
            res.status(201).json(responseOk(userData, addedCollection))
        } catch (e) {
            if (e instanceof ResponseError) {
                res.status(e.status).json({message: e.message})
            } else {
                res.status(500).json()
            }
            next()
        }
    })
    .put(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const updatedCollection = await updateSongsCollection(req.body, userData.id)
            if (!updatedCollection) {
                res.status(404).json()
                return
            }
            res.status(200).json(responseOk(userData, updatedCollection))
        } catch (e) {
            if (e instanceof ResponseError) {
                res.status(e.status).json({message: e.message})
            } else {
                res.status(500).json()
            }
            next()
        }
    })

router.route('/:id')
    .get(logInvokedEndpoint, isIdNumeric, async (req: Request, res: Response, next: NextFunction) => {
        const collectionId = BigInt(req.params.id)
        const data: SongsCollection | null = await getSongsCollectionDataById(collectionId)
        if (!data) {
            res.status(404).json()
        } else {
            res.status(200).json(data)
        }
    })
    .delete(logInvokedEndpoint, authenticateUser, isIdNumeric, async (req: Request, res: Response, next: NextFunction) => {
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).json()
            return
        }

        const collectionId = BigInt(req.params.id)
        const userData = res.locals.user
        const deletedCollection: SongsCollection | null = await deleteSongsCollection(collectionId, userData.id)
        if (deletedCollection) {
            res.status(204).json(responseOk(userData))
        } else {
            res.status(404).json()
        }
    })

router.route('/:songId/playlist/:playlistId')
    .put(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIdsNumeric(true, req.params.songId, req.params.playlistId)
            const songId = BigInt(req.params.songId)
            const playlistId = BigInt(req.params.playlistId)
            const userData = res.locals.user

            await addSongToPlaylist(songId, playlistId, userData.id)
            res.status(204).json()
        } catch (e) {
            next(e)
        }
    })
    .delete(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIdsNumeric(true, req.params.songId, req.params.playlistId)
            const songId = BigInt(req.params.songId)
            const playlistId = BigInt(req.params.playlistId)
            const userData = res.locals.user

            await removeSongFromPlaylist(songId, playlistId, userData.id)
            res.status(204).json()
        } catch (e) {
            next(e)
        }
    })

router.route('/users/:username')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const username = req.params.username
        const user = await findUserByName(username)
        if (!user) {
            res.status(404).json()
            return
        }

        const data: SongsCollection[] = await findPlaylistsFromUser(user.id)
        if (data.length == 0) {
            res.status(404).json()
            return
        }
        res.status(200).json(data)
    })

router.route('/owner/jwt')
    .get(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        const userData = res.locals.user
        const data: SongsCollection[] = await getSongsCollectionsDataFromCreator(userData.id)
        if (data.length == 0) {
            res.status(404).json()
            return
        }
        res.status(200).json(responseOk(userData, data))
    })