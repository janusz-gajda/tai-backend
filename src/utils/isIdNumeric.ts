import {NextFunction, Request, Response} from "express";

export const isIdNumeric = (req: Request, res: Response, next: NextFunction) => {
    if (isNaN(parseInt(req.params.id))) {
        res.status(400).json()
    } else {
        next()
    }
}