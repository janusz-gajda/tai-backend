import {NextFunction, Request, Response} from "express";
import {ResponseError} from "./response";

export const isIdNumeric = (req: Request, res: Response, next: NextFunction) => {
    if (isNaN(parseInt(req.params.id))) {
        throw new ResponseError(400, 'id is not numeric')
    }
    next()
}