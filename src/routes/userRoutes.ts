import express, {NextFunction, Request, Response, Router} from "express";
import {responseOk} from "../utils/response";
import {Permission, User} from "@prisma/client";
import {logInvokedEndpoint} from "../utils/logger";
import {authenticateUser} from "../controllers/authController";
import {getUserPermissions, updateUserPermissions, validateAction} from "../controllers/userController";
import {checkIfUserHasPermission} from "../controllers/permissionController";
import {Permissions} from "../utils/permissions";

export const router: Router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json(responseOk(req.user as User, req.user))
    } catch (e: any) {
        next(e)
    }
})

router.route('/:name/permission/:permission')
    .put(logInvokedEndpoint, validateAction, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        const userData = res.locals.user
        const authUserPermissions: Permission[] = res.locals.permissions as Permission[]
        const updatedUserName = req.params.name
        const permissionToRevoke = req.params.permission
        const action = req.query.action as string
        try {
            checkIfUserHasPermission(authUserPermissions, Permissions.ADMIN)
            await updateUserPermissions(permissionToRevoke, updatedUserName, action)
            res.status(200).json(responseOk(userData))
        } catch (e) {
            next(e)
        }
    })