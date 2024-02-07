import express, {NextFunction, Request, Response, Router} from 'express'
import {logInvokedEndpoint} from "../utils/logger";
import {
    addNewPermission,
    checkIfUserHasPermission,
    deletePermission,
    getPermissionByName,
    getPermissions,
    updatePermission
} from "../controllers/permissionController";
import {Permission} from "@prisma/client";
import {authenticateUser} from "../controllers/authController";
import {getUserPermissions} from "../controllers/userController";
import {responseOk} from "../utils/response";
import {Permissions} from "../utils/permissions";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIfUserHasPermission(res.locals.permissions, Permissions.ADMIN)
            const permissions: Permission[] = await getPermissions()
            res.status(200).json(responseOk(res.locals.user, permissions))
        } catch (e) {
            next(e)
        }
    })
    .post(logInvokedEndpoint, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIfUserHasPermission(res.locals.permissions, Permissions.ADMIN)
            const addedPermission: Permission = await addNewPermission(req.body.name, req.body.description)
            res.status(201).json(responseOk(res.locals.user, addedPermission))
        } catch (e) {
            next(e)
        }
    })

router.route('/:name')
    .get(logInvokedEndpoint, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIfUserHasPermission(res.locals.permissions, Permissions.ADMIN)
            const foundPermission = await getPermissionByName(req.params.name)
            res.status(200).json(responseOk(res.locals.user, foundPermission))
        } catch (e) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIfUserHasPermission(res.locals.permissions, Permissions.ADMIN)
            const updatedPermissionData = {
                name: req.body.name as string,
                description: req.body.description as string
            }
            const updatedPermission = await updatePermission(req.params.name, updatedPermissionData)
            res.status(200).json(responseOk(res.locals.user, updatedPermission))
        } catch (e) {
            next(e)
        }
    })
    .delete(logInvokedEndpoint, authenticateUser, getUserPermissions, async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkIfUserHasPermission(res.locals.permissions, Permissions.ADMIN)
            await deletePermission(req.params.name)
            res.status(204).json(responseOk(res.locals.user))
        } catch (e) {
            next(e)
        }
    })
