import {User} from "@prisma/client"
import {findUserByEmail, findUserById, findUserByName} from "../repositories/userRepository"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import {randomBytes} from "crypto"
import {NextFunction, Request, Response} from "express";

export const secret = randomBytes(128).toString("hex")

export function signJWT(user: User): string{
    //TODO:
    // ewentualnie dodać więcej pól do tokena
    const payload = {
        _id: user.id,
        _toc: Date.now() //timeOfCreation
    }
    return jwt.sign(payload, secret)
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
            res.status(401).json({message: 'jwt token missing'})
            return
        }

        const payload: jwt.JwtPayload = jwt.verify(token, secret) as jwt.JwtPayload
        const user: User | null = await findUserById(payload._id)
        if (!user) {
            res.status(401).json({message: 'user not found'})
            return
        }

        res.locals.user = user
        next()
    } catch (e) {
        res.status(401).json({message: 'auth failed'})
    }
}

export async function authUser(data: string, password: string): Promise<User | null> {
    let user = await findUserByEmail(data)
    user = user ? user : await findUserByName(data)
    if (!user) {
        return null
    }

    if (user.password && !await bcrypt.compare(password, user.password)) {
        return null
    }
    return user
}