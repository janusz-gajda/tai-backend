import express, {Express} from "express";
import passport from "passport";
import {router as permissionsRouter} from "../routes/permissionRoutes";
import {router as authRouter} from "../routes/authRoutes";
import {router as userRouter} from "../routes/userRoutes";
import {router as sharedContentRouter} from "../routes/sharedContentRoutes"
import {router as songsRouter} from "../routes/songsRoutes"
import {router as songsCollectionRouter} from "../routes/songsCollectionRoutes"
import {errorHandler} from "../utils/response";
import {jwtStrategy} from "./passportController";
import swaggerUi from "swagger-ui-express";
import swaggerFile from '../../docs/backend-server-api.json'
import cors from 'cors'

export const app: Express = express()

passport.use("jwt", jwtStrategy)

app.use(cors())

app.use(express.json())
app.use('/permissions', permissionsRouter)
app.use('/auth', authRouter)
app.use('/collections', songsCollectionRouter)
app.use('/user', passport.authenticate("jwt", {session: false}), userRouter)
app.use('/songs', songsRouter)
app.use('/sharedContent', sharedContentRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(errorHandler)