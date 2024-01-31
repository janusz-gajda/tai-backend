import {ResponseError} from "./response";

export function throwIfArrayIsEmpty(data: any[]) {
    if (data.length == 0) {
        throw new ResponseError(404, 'not found')
    }
}

export function throwIfObjectIsNull(data: any) {
    if (!data) {
        throw new ResponseError(404, 'not found')
    }
}