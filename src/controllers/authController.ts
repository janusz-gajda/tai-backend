import {User} from "@prisma/client"
import { findUserByEmail, findUserById } from "../repositories/userRepository"
import bcrypt from "bcrypt"
import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { randomBytes } from "crypto"

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

export async function authUserByEmail(email: string, password: string): Promise<User | null> {
    const user = await findUserByEmail(email)
    if (!user) {
        return null
    }
    if (!await bcrypt.compare(password, user.password)) {
        return null
    }
    return user
}