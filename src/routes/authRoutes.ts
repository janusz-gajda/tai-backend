import express, {Request, Response} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {authUser} from "../controllers/authController";
import {User} from "@prisma/client";
import {responseOk} from "../utils/response";
import {addUser} from "../controllers/userController";
import {findUserByEmail} from "../repositories/userRepository";
import {getUserData, verifyUser} from "../controllers/googleOAuthController";

export const router = express.Router()

router.route('/login').post(logInvokedEndpoint, async (req: Request, res: Response) => {
    const username: string = req.body.username as string
    const password: string = req.body.password as string
    if (!username || !password) {
        res.status(400).json({message: 'username and password are required'})
        return
    }
    const user: User | null = await authUser(username, password)
    if (!user) {
        res.status(401).json({message: 'invalid credentials'})
        return
    }
    res.status(200).json(responseOk(user, user))
})

router.route('/register').post(logInvokedEndpoint, async (req: Request, res: Response) => {
    const name: string = req.body.name
    const email: string = req.body.email
    const password: string = req.body.password
    if (!name || !email || !password) {
        res.status(400).json({message: 'name, email and password are required'})
        return
    }
    if (await findUserByEmail(email)) {
        res.status(409).json({message: 'user already exists'})
        return
    }
    const user: User = await addUser(name, email, password)
    res.status(201).json(responseOk(user, user))
})

router.route('/google/callback')
    .get(async (req: Request, res: Response, next) => {
        try {
            const userInfo = await getUserData(req.query.code as string)
            const user: User = await verifyUser(userInfo)
            res.status(200).json(responseOk(user, user))
        } catch (e) {
            next(e)
        }
    })