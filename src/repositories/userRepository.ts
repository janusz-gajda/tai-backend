import {Prisma, PrismaClient, User} from "@prisma/client"

const prisma = new PrismaClient()

export async function createUser(user: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({data: user})
}

export async function findUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

export async function findUserByName(name: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: {
            name: name
        }
    })
}

export async function findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    })
}

export async function findUserByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findFirst({
        where: {
            googleId: googleId
        }
    })
}

export async function updateUser(id: number, updateData: Prisma.UserUpdateInput) {
    return prisma.user.update({
        where: {
            id: id
        },
        data: {
            name: updateData.name,
            email: updateData.email
        }
    })
}

export async function assignPermissionToUser(userName: string, permissionName: string): Promise<User | null> {
    return prisma.user.update({
        where: {
            name: userName
        },
        data: {
            permissions: {
                connect: {
                    name: permissionName
                }
            }
        }
    })
}

export async function revokePermissionFromUser(userName: string, permissionName: string) {
    return prisma.user.update({
        where: {name: userName},
        data: {
            permissions: {
                disconnect: {
                    name: permissionName
                }
            }
        }
    })
}

export async function setGoogleIdToExistingUserOrCreateNewUser(user: Prisma.UserCreateInput) {
    return prisma.user.upsert({
        where: {
            email: user.email
        },
        update: {
            googleId: user.googleId
        },
        create: user
    })
}

export async function deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
        where: {
            id: id
        }
    })
}

export async function findPermissionsFromUser(id: number) {
    return prisma.user.findUnique({
        select: {
            permissions: true
        },
        where: {
            id: id
        }
    }).permissions()
}