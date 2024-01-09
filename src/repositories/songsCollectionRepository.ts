import {Prisma, PrismaClient, SongsCollection} from '@prisma/client'

const prisma = new PrismaClient()

export async function findCollections(): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany()
}