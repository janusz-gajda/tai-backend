import express, {NextFunction, Request, Response, Router} from "express";
import {responseOk} from "../utils/response";
import {Permission, User} from "@prisma/client";
import {logInvokedEndpoint} from "../utils/logger";
import {authenticateUser} from "../controllers/authController";
import {
    changePassword,
    getUserPermissions,
    PasswordUpdate,
    updateUserData,
    updateUserPermissions,
    UserUpdate
} from "../controllers/userController";
import {checkIfUserHasPermission} from "../controllers/permissionController";
import {Permissions} from "../utils/permissions";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json(responseOk(req.user as User, req.user))
        } catch (e: any) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const updateData: UserUpdate = req.body as UserUpdate
            const updatedUser = await updateUserData(userData.id, updateData)
            res.status(200).json(responseOk(updatedUser))
        } catch (e) {
            next(e)
        }
    })

router.route('/password')
    .put(logInvokedEndpoint, authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = res.locals.user
            const passwords: PasswordUpdate = req.body
            const updatedUser = await changePassword(userData, passwords)
            res.status(200).json(responseOk(updatedUser))
        } catch (e) {
            next(e)
        }
    })

router.route('/:name/permission/:permission')
    .post(logInvokedEndpoint, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        await manageUserPermission(req, res, next)
    })
    .put(logInvokedEndpoint, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        await manageUserPermission(req, res, next)
    })

async function manageUserPermission(req: Request, res: Response, next: NextFunction) {
    const userData = res.locals.user
    const authUserPermissions: Permission[] = res.locals.permissions as Permission[]
    const updatedUserName = req.params.name
    const permissionToRevoke = req.params.permission
    try {
        checkIfUserHasPermission(authUserPermissions, Permissions.ADMIN)
        await updateUserPermissions(permissionToRevoke, updatedUserName, req.method)
        res.status(200).json(responseOk(userData))
    } catch (e) {
        next(e)
    }
}