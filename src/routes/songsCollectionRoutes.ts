import express, {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {findPlaylistsFromUserById} from "../repositories/songsCollectionRepository";
import {SongsCollection} from "@prisma/client";
import {addCollection, getCollectionsData} from "../controllers/songsCollectionController";
import {findUserByName} from "../repositories/userRepository";
import {ResponseError} from "../utils/response";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const collectionType = req.query.type as string
        const data: SongsCollection[] | null = await getCollectionsData(collectionType)
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
        try {
            // TODO: autentykacja usera + wzięcie id z tokena jwt i ustawienie go jako creatorId
            const addedCollection = await addCollection(req.body)
            res.status(201).json(addedCollection)
        } catch (e) {
            if (e instanceof ResponseError) {
                res.status(e.status).json({message: e.message})
            }
            res.status(500).json()
            next()
        }
    })

router.route('/:username')
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