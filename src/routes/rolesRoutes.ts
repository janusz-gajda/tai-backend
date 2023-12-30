import express, {NextFunction, Request, Response, Router} from 'express'
import {logInvokedEndpoint} from "../utils/logger";
import {addNewRole, deleteRole} from "../controllers/rolesController";
import {findRoleByName, findRoles, updateRole} from "../repositories/rolesRepository";
import {Prisma, Roles} from "@prisma/client";

export const router: Router = express.Router()

router.route('/')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const roles: Roles[] = await findRoles()
        res.status(200).json(roles)
    })
    .post(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const addedRole: Roles = await addNewRole(req.body.name, req.body.description)
            res.status(201).json(addedRole)
        } catch (e) {
            res.status(400).json()
            next()
        }
    })

router.route('/:name')
    .get(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const role: Roles | null = await findRoleByName(req.params.name)
        if (!role) {
            res.status(404).json()
        } else {
            res.status(200).json(role)
        }
    })
    .put(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const role: Roles | null = await findRoleByName(req.params.name)
        if (!role) {
            res.status(404).json({message: 'role not found'})
            return
        }

        const updatedData: Prisma.RolesUpdateInput = {
            name: req.body.name,
            description: req.body.description
        }

        try {
            const updatedRole = await updateRole(req.params.name, updatedData)
            res.status(200).json(updatedRole)
        } catch (e) {
            res.status(400).json()
            next()
        }
    })
    .delete(logInvokedEndpoint, async (req: Request, res: Response, next: NextFunction) => {
        const deletedRole: Roles | null = await deleteRole(req.params.name)
        if (!deletedRole) {
            res.status(404).json({message: 'role not found'})
        } else {
            res.status(204).json()
        }
    })
