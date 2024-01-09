import express, {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";


export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {

    })