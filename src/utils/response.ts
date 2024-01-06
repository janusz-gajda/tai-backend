import { User } from "@prisma/client"
import { signJWT } from "../controllers/authController"

export function responseOk(user: User, payload: any = {}) {
    return {_token: signJWT(user), payload: payload}
}

export class ResponseError extends Error{
    status: number
    constructor(status = 500, message = "Something went wrong") {
        super(message)
        this.status = status
    }
}