import {User} from "@prisma/client"
import { findUserByEmail, findUserById } from "../repositories/userRepository"
import bcrypt from "bcrypt"
import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { randomBytes } from "crypto"

const secret = randomBytes(128).toString("hex")

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

export const jwtStrategy = new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}, async (payload, done) => {
    try{
        if (Date.now() - payload._toc > 7200000){
            return done('Token expired', false)
        }
        const user = await findUserById(payload._id)
        if(!user){
            return done(null, false)
        }
        return done(null, user)

    } catch (e: any){
        return done(e.message, false)
    }
})