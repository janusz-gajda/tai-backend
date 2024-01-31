import express, {NextFunction, Request, Response, Router} from 'express'
import {logInvokedEndpoint} from "../utils/logger";
import {addNewRole, deleteRole, getRoleByName, getRoles, updateRole} from "../controllers/roleController";
import {Role} from "@prisma/client";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const roles: Role[] = await getRoles()
        res.status(200).json(roles)
    })
    .post(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const addedRole: Role = await addNewRole(req.body.name, req.body.description)
            res.status(201).json(addedRole)
        } catch (e) {
            next(e)
        }
    })

router.route('/:name')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const foundRole = await getRoleByName(req.params.name)
            res.status(200).json(foundRole)
        } catch (e) {
            next(e)
        }
    })
    .put(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedRoleData = {
                name: req.body.name as string,
                description: req.body.description as string
            }
            const updatedRole = await updateRole(req.params.name, updatedRoleData)
            res.status(200).json(updatedRole)
        } catch (e) {
            next(e)
        }
    })
    .delete(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteRole(req.params.name)
            res.status(204).json()
        } catch (e) {
            next(e)
        }
    })
