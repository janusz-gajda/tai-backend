import {NextFunction, Request, Response} from "express";
import {ResponseError} from "./response";

export const isIdNumeric = (req: Request, res: Response, next: NextFunction) => {
    if (!checkIdsNumeric(false, req.params.id)) {
        throw new ResponseError(400, 'id is not numeric')
    }
    next()
}

export function checkIdsNumeric(throwIfNotNumeric: boolean, ...ids: string[]) {
    ids.forEach(id => {
        if (isNaN(parseInt(id))) {
            if (throwIfNotNumeric) {
                throw new ResponseError(400, 'id(s) not numeric')
            }
            return false
        }
    })
    return true
}