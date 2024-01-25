import express, {Express, NextFunction, Request, Response} from "express";
import passport from "passport";
import {router as rolesRouter} from "../routes/roleRoutes";
import {router as authRouter} from "../routes/authRoutes";
import {router as userRouter} from "../routes/userRoutes";
import {router as songsCollectionRouter} from "../routes/songsCollectionRoutes"
import {ResponseError} from "../utils/response";
import {logError} from "../utils/logger";
import {jwtStrategy} from "./passportController";
import {oauthGoogleStrategy} from "./authGoogleStrategy";

export const app: Express = express()

passport.use("jwt", jwtStrategy)
passport.use(oauthGoogleStrategy)

app.use(express.json())
app.use('/roles', rolesRouter)
app.use('/auth', authRouter)
app.use('/collections', songsCollectionRouter)
app.use('/user', passport.authenticate("jwt", {session: false}), userRouter)

app.use(function (err: (ResponseError | Error), req: Request, res: Response, next: NextFunction) {
    logError(err)
    if (err instanceof ResponseError) {
        res.status(err.status)
    } else {
        res.status(500)
    }
    res.json({message: err.message})
})