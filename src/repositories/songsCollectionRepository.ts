import {ContentType, Prisma, PrismaClient, SongsCollection} from '@prisma/client'

const prisma = new PrismaClient()

export async function findAllCollections(): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany({
        include: {
            songs: true
        }
    })
}

export async function findCollectionsByContentType(collectionType: ContentType): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany({
        where: {
            type: collectionType
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

export async function createSongsCollection(collection: Prisma.SongsCollectionCreateInput, creatorId?: bigint): Promise<SongsCollection> {
    return prisma.songsCollection.create({
        data: {
            name: collection.name,
            description: collection.description,
            type: collection.type,
            access: collection.access,
            creator: {
                connect: {id: creatorId}
            }
        },
        include: {
            creator: true
        }
    })
}