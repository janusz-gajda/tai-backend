import {Prisma, User} from "@prisma/client";
import {createUser, findUserByEmail, findUserById, findUserByName, updateUser} from "../repositories/userRepository";
import bcrypt from "bcrypt"
import "dotenv/config"

const saltRounds: number = Number(process.env.SALT_ROUNDS) || 10

export async function addUser(name: string, email: string, password: string): Promise<User> {
    const user: Prisma.UserCreateInput = {
        name: name,
        email: email,
        password: await hashPassword(password)
    }

    return await createUser(user)
}

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds)
}

export async function generateRandomPassword(): Promise<string> {
    // zrobiłem to dla zwały xd
    const str = Math.random().toString(36).substring(2, 10)
    return await hashPassword(str)
}