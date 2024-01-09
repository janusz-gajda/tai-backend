import {ContentType, PrismaClient, SongsCollection} from '@prisma/client'

const prisma = new PrismaClient()

export async function findAllCollections(): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany({
        include: {
            songs: true
        }
    })
}

export async function findCollectionsByContentType(contentType: ContentType): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany({
        where: {
            type: contentType
        },
        include: {
            songs: true
        }
    })
}

export async function findPlaylistsFromUserById(userId: bigint): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany({
        where: {
            type: ContentType.PLAYLIST,
            creatorId: userId
        },
        include: {
            songs: true
        }
    })
}