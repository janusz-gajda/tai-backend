import express, {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {ContentType, SongsCollection} from "@prisma/client";
import {
    addSongsCollection,
    deleteSongsCollection,
    getSongsCollectionDataById,
    getSongsCollectionsData,
    getSongsCollectionsDataFromCreator,
    updateSongsCollection
} from "../controllers/songsCollectionController";
import {responseOk} from "../utils/response";
import {authenticateUser} from "../controllers/authController";
import {isIdNumeric} from "../utils/isIdNumeric";
import {getUserIdByName} from "../controllers/userController";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const collectionType = req.query.type as string
        try {
            const data: SongsCollection[] = await getSongsCollectionsData(collectionType)
            res.status(200).json(data)
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
            if (!updatedCollection) {
                res.status(404).json()
                return
            }
            res.status(200).json(responseOk(userData, updatedCollection))
        } catch (e) {
            next(e)
        }
    })

router.route('/:id')
    .get(logInvokedEndpoint, isIdNumeric, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collectionId = BigInt(req.params.id)
            const data: SongsCollection = await getSongsCollectionDataById(collectionId)
            res.status(200).json(data)
        } catch (e) {
            next(e)
        }
    })
    .delete(logInvokedEndpoint, authenticateUser, isIdNumeric, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collectionId = BigInt(req.params.id)
            const userData = res.locals.user
            await deleteSongsCollection(collectionId, userData.id)
            res.status(204).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })

router.route('/users/:username')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: bigint = await getUserIdByName(req.params.username)
            const data: SongsCollection[] = await getSongsCollectionsDataFromCreator(userId, ContentType.PLAYLIST)
            res.status(200).json(data)
        } catch (e) {
            next(e)
        }
    })

router.route('/owner/jwt')
    .get(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const data: SongsCollection[] = await getSongsCollectionsDataFromCreator(userData.id, ContentType.PLAYLIST)
            res.status(200).json(responseOk(userData, data))
        } catch (e) {
            next(e)
        }
    })