import {NextFunction, Request, Response} from "express";

export const logInvokedEndpoint = (req: Request, res: Response, next: NextFunction) => {
    const now: Date = new Date()
    const date: string = now.toDateString()
    const time: string = now.toTimeString().slice(0, 8)
    console.log(`[${date}, ${time}]`, req.method, req.url, 'was invoked')
    next()
}