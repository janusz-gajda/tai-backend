import {Permission, Prisma, PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export async function findPermissions(): Promise<Permission[]> {
    return prisma.permission.findMany()
}

export async function findPermissionByName(name: string): Promise<Permission | null> {
    return prisma.permission.findUnique({
        where: {
            name: name
        }
    })
}

export async function createPermission(permission: Prisma.PermissionCreateInput): Promise<Permission> {
    return prisma.permission.create({data: permission})
}

export async function updatePermissionData(name: string, updateData: Prisma.PermissionUpdateInput) {
    return prisma.permission.update({
        where: {
            name: name
        },
        data: {
            name: updateData.name,
            description: updateData.description
        }
    })
}

export async function deletePermissionByName(name: string): Promise<Permission> {
    return prisma.permission.delete({
        where: {
            name: name
        }
    })
}