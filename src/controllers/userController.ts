import {Prisma, User} from "@prisma/client";
import {createUser, findUserByEmail, findUserById, findUserByName, updateUser} from "../repositories/userRepository";
import bcrypt from "bcrypt"
import "dotenv/config"

export async function addUser(name: string, email: string, password: string): Promise<User> {

    const user: Prisma.UserCreateInput = {
        name: name,
        email: email,
        password: await bcrypt.hash(password, process.env.SALT_ROUNDS || 10)
    }

    return await createUser(user)
}