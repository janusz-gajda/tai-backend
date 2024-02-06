import express, {NextFunction, Request, Response, Router} from 'express'
import {logInvokedEndpoint} from "../utils/logger";
import {
    addNewPermission,
    deletePermission,
    getPermissionByName,
    getPermissions,
    updatePermission
} from "../controllers/permissionController";
import {Permission} from "@prisma/client";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const permissions: Permission[] = await getPermissions()
        res.status(200).json(permissions)
    })
    .post(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const addedPermission: Permission = await addNewPermission(req.body.name, req.body.description)
            res.status(201).json(addedPermission)
        } catch (e) {
            next(e)
        }
    })

router.route('/:name')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const foundPermission = await getPermissionByName(req.params.name)
            res.status(200).json(foundPermission)
        } catch (e) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedPermissionData = {
                name: req.body.name as string,
                description: req.body.description as string
            }
            const updatedPermission = await updatePermission(req.params.name, updatedPermissionData)
            res.status(200).json(updatedPermission)
        } catch (e) {
            next(e)
        }
    })
    .delete(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deletePermission(req.params.name)
            res.status(204).json()
        } catch (e) {
            next(e)
        }
    })
