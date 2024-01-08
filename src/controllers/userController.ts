import {Prisma, User} from "@prisma/client";
import {createUser, findUserByEmail, findUserById, findUserByName, updateUser} from "../repositories/userRepository";
import bcrypt from "bcrypt"
import "dotenv/config"

const saltRounds = (process.env.SALT_ROUNDS || 10) as number

export async function addUser(name: string, email: string, password: string): Promise<User> {

    const user: Prisma.UserCreateInput = {
        name: name,
        email: email,
        password: await bcrypt.hash(password, saltRounds)
    }

    return await createUser(user)
}