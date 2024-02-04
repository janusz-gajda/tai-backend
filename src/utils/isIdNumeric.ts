import {NextFunction, Request, Response} from "express";
import {ResponseError} from "./response";

export const isIdNumeric = (req: Request, res: Response, next: NextFunction) => {
    try {
        checkIdsNumeric(req.params.id)
    } catch (e) {
        next(e)
    }
    next()
}

export function checkIdsNumeric(...ids: string[]) {
    ids.forEach(id => {
        if (isNaN(parseInt(id))) {
                throw new ResponseError(400, 'id(s) not numeric')
        }
    })
}