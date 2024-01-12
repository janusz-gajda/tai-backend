import express, {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {findPlaylistsFromUserById} from "../repositories/songsCollectionRepository";
import {SongsCollection} from "@prisma/client";
import {
    addSongsCollection,
    deleteSongsCollection,
    getSongsCollectionDataById,
    getSongsCollectionsData, updateSongsCollection
} from "../controllers/songsCollectionController";
import {findUserByName} from "../repositories/userRepository";
import {ResponseError} from "../utils/response";

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
    .post(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        // TODO: autentykacja usera + wzięcie id z tokena jwt i ustawienie go jako creatorId
        const creatorId = req.body.creatorId
        if (creatorId == undefined) {
            res.status(400).json()
            return
        }
        try {
            const addedCollection = await addSongsCollection(req.body, creatorId)
            res.status(201).json(addedCollection)
        } catch (e) {
            if (e instanceof ResponseError) {
                res.status(e.status).json({message: e.message})
            } else {
                res.status(500).json()
            }
            next()
        }
    })
    .put(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedCollection = await updateSongsCollection(req.body)
            if (!updatedCollection) {
                res.status(404).json()
            } else {
                res.status(200).json(updatedCollection)
            }
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
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).json()
            return
        }

        const collectionId = BigInt(req.params.id)
        const data: SongsCollection | null = await getSongsCollectionDataById(collectionId)
        if (!data) {
            res.status(404).json()
        } else {
            res.status(200).json(data)
        }
    })
    .delete(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const collectionId = BigInt(req.params.id)
        const deletedCollection: SongsCollection | null = await deleteSongsCollection(collectionId)
        if (deletedCollection) {
            res.status(204).json()
        } else {
            res.status(404).json()
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

        const data: SongsCollection[] = await findPlaylistsFromUserById(user.id)
        if (data.length == 0) {
            res.status(404).json()
            return
        }
        res.status(200).json(data)
    })