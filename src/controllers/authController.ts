import {User} from "@prisma/client"
import { findUserByEmail } from "../repositories/userRepository"
import bcrypt from "bcrypt"
import "dotenv/config"

export async function authUserByEmail(email: string, password: string): Promise<User | null> {
    const user = await findUserByEmail(email)
    if (!user) {
        return null
    }
    if (!await bcrypt.compare(password, user.password)) {
        return null
    }
    return user
}