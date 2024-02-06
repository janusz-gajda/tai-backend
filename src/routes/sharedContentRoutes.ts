import {NextFunction, Request, Response, Router} from "express";
import {logInvokedEndpoint} from "../utils/logger";
import {authenticateUser} from "../controllers/authController";
import {ContentType} from "@prisma/client";
import {isIdNumeric} from "../utils/isIdNumeric";
import {shareContent, unshareContent} from "../controllers/sharedContentController";
import {responseOk} from "../utils/response";

export const router: Router = Router()

router.route('/user/:username/content/:id')
    .post(logInvokedEndpoint, isIdNumeric, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const contentId = BigInt(req.params.id)
            const recipientName = req.params.username
            const contentType = req.query.type as ContentType
            await shareContent(contentId, contentType, recipientName, userData.id)
            res.status(200).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, isIdNumeric, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const contentId = BigInt(req.params.id)
            const recipientName = req.params.username
            const contentType = req.query.type as ContentType
            await unshareContent(contentId, contentType, recipientName, userData.id)
            res.status(200).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })