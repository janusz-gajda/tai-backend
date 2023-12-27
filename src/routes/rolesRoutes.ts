import express, {NextFunction, Request, Response, Router} from 'express'
import {logInvokedEndpoint} from "../utils/logger";
import {addNewRole, deleteRole} from "../controllers/rolesController";
import {findRoleByName, findRoles} from "../repositories/rolesRepository";
import {Roles} from "@prisma/client";

export const router: Router = express.Router()

router.get('/', logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
    const roles: Roles[] = await findRoles()
    if (roles === null || roles.length === 0) {
        res.status(404).json()
    } else {
        res.status(200).json(roles)
    }
})

router.get('/:name', logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
    const role = await findRoleByName(req.params.name)
    if (!role) {
        res.status(404).json()
    } else {
        res.status(200).json(role)
    }
})

router.post('/', logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addedRole = await addNewRole(req.body.name, req.body.description)
        res.status(201).json(addedRole)
    } catch (e) {
        res.status(500).json()
        next()
    }
})

router.delete('/:name', logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
    const deletedRole = await deleteRole(req.params.name)
    if (!deletedRole) {
        res.status(404).json({message: 'role not found'})
    } else {
        res.status(204).json()
    }
})
