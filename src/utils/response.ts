import {User} from "@prisma/client"
import {signJWT} from "../controllers/authController"
import {NextFunction, Request, Response} from "express";
import {logError} from "./logger";

export function responseOk(user: User, payload: any = {}) {
    return {_token: signJWT(user), payload: payload}
}

export class ResponseError extends Error {
    status: number

    constructor(status = 500, message = "Something went wrong") {
        super(message)
        this.status = status
    }
}

export function errorHandler(e: (ResponseError | Error), req: Request, res: Response, next: NextFunction) {
    logError(e)
    const status = e instanceof ResponseError ? e.status : 500
    res.status(status).json({message: e.message})
}