import {Prisma, User} from "@prisma/client";
import {
    assignPermissionToUser,
    createUser,
    findPermissionsFromUser,
    findUserByName,
    revokePermissionFromUser,
    updateUser,
    updateUserPassword
} from "../repositories/userRepository";
import bcrypt from "bcrypt"
import "dotenv/config"
import {NextFunction, Request, Response} from "express";
import {ResponseError} from "../utils/response";
import {findPermissionByName} from "../repositories/permissionRepository";

const saltRounds: number = Number(process.env.SALT_ROUNDS) || 10

export type UserUpdate = {
    name: string,
    email: string
}

export type PasswordUpdate = {
    oldPassword: string,
    newPassword: string
}

export async function getUserIdByName(name: string): Promise<bigint> {
    const user = await findUserByName(name)
    if (!user) {
        throw new ResponseError(404, 'user not found')
    }
    return user?.id
}

export async function addUser(name: string, email: string, password: string): Promise<User> {
    const user: Prisma.UserCreateInput = {
        name: name,
        email: email,
        password: await hashPassword(password)
    }

    return await createUser(user)
}

export async function updateUserData(userId: bigint, data: UserUpdate): Promise<User> {
    return await updateUser(userId, data)
}

export async function updateUserPermissions(permissionName: string, userName: string, requestMethod: string) {
    if (!(await findPermissionByName(permissionName))) {
        throw new ResponseError(404, 'role not found')
    }

    let updatedUser = null
    if (requestMethod === 'POST') {
        updatedUser = await assignPermissionToUser(userName, permissionName)
    } else if (requestMethod === 'PUT') {
        updatedUser = await revokePermissionFromUser(userName, permissionName)
    }
    if (!updatedUser) {
        throw new ResponseError(404, 'user not found')
    }
    return updatedUser
}

export async function changePassword(user: User, passwords: PasswordUpdate) {
    if (user.password) {
        if (passwords.oldPassword === passwords.newPassword) {
            throw new ResponseError(400, 'passwords are the same')
        }
        if (!(await bcrypt.compare(passwords.oldPassword, user.password))) {
            throw new ResponseError(400, 'old password mismatch with actual user\'s password')
        }
    }
    return await updateUserPassword(user.id, await hashPassword(passwords.newPassword))
}

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds)
}

export const getUserPermissions = async (req: Request, res: Response, next: NextFunction) => {
    const userData = res.locals.user
    res.locals.permissions = await findPermissionsFromUser(userData.id)
    next()
}