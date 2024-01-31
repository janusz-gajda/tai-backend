import {Prisma, PrismaClient, Role} from "@prisma/client"

const prisma = new PrismaClient()

export async function findRoles(): Promise<Role[]> {
    return prisma.role.findMany()
}

export async function findRoleByName(name: string): Promise<Role | null> {
    return prisma.role.findUnique({
        where: {
            name: name
        }
    })
}

export async function createRole(role: Prisma.RoleCreateInput): Promise<Role> {
    return prisma.role.create({data: role})
}

export async function updateRoleData(name: string, updateData: Prisma.RoleUpdateInput) {
    return prisma.role.update({
        where: {
            name: name
        },
        data: {
            name: updateData.name,
            description: updateData.description
        }
    })
}

export async function deleteRoleByName(name: string): Promise<Role> {
    return prisma.role.delete({
        where: {
            name: name
        }
    })
}