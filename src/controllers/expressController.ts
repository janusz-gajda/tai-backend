import express, {Express} from "express";
import passport from "passport";
import {router as rolesRouter} from "../routes/roleRoutes";
import {router as authRouter} from "../routes/authRoutes";
import {router as userRouter} from "../routes/userRoutes";
import {router as songsRouter} from "../routes/songsRoutes"
import {router as songsCollectionRouter} from "../routes/songsCollectionRoutes"
import {errorHandler} from "../utils/response";
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
app.use('/songs', songsRouter)

app.use(errorHandler)