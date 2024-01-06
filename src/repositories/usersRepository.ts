import {Prisma, PrismaClient, Users} from "@prisma/client"

const prisma = new PrismaClient()

export async function createUser(user: Prisma.UsersCreateInput): Promise<Users>