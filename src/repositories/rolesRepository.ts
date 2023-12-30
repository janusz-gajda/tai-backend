import {Prisma, PrismaClient, Roles} from '@prisma/client'

const prisma = new PrismaClient()

export async function findRoles(): Promise<Roles[]> {
    return prisma.roles.findMany()
}

export async function findRoleByName(name: string): Promise<Roles | null> {
    return prisma.roles.findUnique({
        where: {
            name: name
        }
    })
}

export async function createRole(role: Prisma.RolesCreateInput): Promise<Roles> {
    return prisma.roles.create({data: role})
}

export async function updateRole(name: string, updateData: Prisma.RolesUpdateInput) {
    return prisma.roles.update({
        where: {
            name: name
        },
        data: {
            name: updateData.name,
            description: updateData.description
        }
    })
}

export async function deleteRoleByName(name: string): Promise<Roles> {
    return prisma.roles.delete({
        where: {
            name: name
        }
    })
}