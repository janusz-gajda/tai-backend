import express, {Express, Request, Response, NextFunction} from "express";
import {router as rolesRouter} from "../routes/roleRoutes";
import { ResponseError } from "../utils/response";
import { logError } from "../utils/logger";

export const app: Express = express()

app.use(express.json())
app.use('/roles', rolesRouter)

app.use(function(err: (ResponseError | Error), req: Request, res: Response, next: NextFunction){
    logError(err)
    if(err instanceof ResponseError){
        res.status(err.status)
    } else{
        res.status(500)
    }
    res.json({message: err.message})
})