import express, {NextFunction, Request, Response, Router} from "express";
import { ResponseError, responseOk } from "../utils/response";
import { User } from "@prisma/client";

export const router: Router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).json(responseOk(req.user as User, req.user))
    } catch(e: any){
        next(e)
    }
})