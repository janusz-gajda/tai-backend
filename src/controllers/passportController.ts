import bcrypt from "bcrypt"
import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt"
import jwt from "jsonwebtoken"
import { findUserById } from "../repositories/userRepository"
import {secret} from "../controllers/authController"

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