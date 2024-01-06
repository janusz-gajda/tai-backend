import express, {Express} from "express";
import {router as rolesRouter} from "../routes/roleRoutes";

export const app: Express = express()

app.use(express.json())
app.use('/roles', rolesRouter)