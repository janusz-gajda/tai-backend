import express, {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {findPlaylistsFromUserById} from "../repositories/songsCollectionRepository";
import {SongsCollection} from "@prisma/client";
import {getCollectionsData} from "../controllers/songsCollectionController";
import {findUserByName} from "../repositories/userRepository";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const contentType = req.query.contentType as string
        const data: SongsCollection[] | null = await getCollectionsData(contentType)

        if (!data) {
            res.status(400).json({message: 'invalid content type'})
            return
        }
        if (data.length == 0) {
            res.status(404).json()
            return
        }
        res.status(200).json(data)
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