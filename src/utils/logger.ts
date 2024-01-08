import {NextFunction, Request, Response} from "express";
import { ResponseError } from "./response";

export const logInvokedEndpoint = (req: Request, res: Response, next: NextFunction) => {
    const now: Date = new Date()
    const date: string = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const time: string = now.toTimeString().slice(0, 8)
    console.log(`[${date} ${time}]`, req.method, req.originalUrl, 'was invoked')
    next()
}

export const logError = (err: (ResponseError | Error)): void => {
    const now: Date = new Date()
    const date: string = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const time: string = now.toTimeString().slice(0, 8)
    if(err instanceof ResponseError){
        console.error(`[${date} ${time}] ${err.message}`)
    } else{
        console.error(`[${date} ${time}] ${err.message}\n${err.stack}`)
    }
    
}