import {Prisma, User} from "@prisma/client";
import {
    createUser,
    findPermissionsFromUser,
    findUserByName,
    updatePermissionsFromUser
} from "../repositories/userRepository";
import bcrypt from "bcrypt"
import "dotenv/config"
import {throwIfObjectIsNull} from "../utils/dataChecks";
import {NextFunction, Request, Response} from "express";
import {ResponseError} from "../utils/response";
import {findPermissionByName} from "../repositories/permissionRepository";

const saltRounds: number = Number(process.env.SALT_ROUNDS) || 10

export async function getUserIdByName(name: string): Promise<bigint> {
    const user = await findUserByName(name)
    throwIfObjectIsNull(user)
    return user?.id as bigint
}

export async function addUser(name: string, email: string, password: string): Promise<User> {
    const user: Prisma.UserCreateInput = {
        name: name,
        email: email,
        password: await hashPassword(password)
    }

    return await createUser(user)
}

export async function updateUserPermissions(permissionName: string, userName: string, action: string) {
    if (!(await findPermissionByName(permissionName))) {
        throw new ResponseError(404, 'role not found')
    }

    const updatedUser = await updatePermissionsFromUser(userName, permissionName, action)
    if (!updatedUser) {
        throw new ResponseError(404, 'user not found')
    }
    return updatedUser
}

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds)
}

export async function generateRandomPassword(): Promise<string> {
    // zrobiłem to dla zwały xd
    const str = Math.random().toString(36).substring(2, 10)
    return await hashPassword(str)
}

export const getUserPermissions = async (req: Request, res: Response, next: NextFunction) => {
    const userData = res.locals.user
    res.locals.permissions = await findPermissionsFromUser(userData.id)
    next()
}

export const validateAction = async (req: Request, res: Response, next: NextFunction) => {
    const action = req.query.action as string
    if ('ASSIGN' !== action.toUpperCase() && 'REVOKE' !== action.toUpperCase()) {
        throw new ResponseError(400, 'invalid action')
    }
    next()
}