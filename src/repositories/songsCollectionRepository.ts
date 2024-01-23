import {ContentType, Prisma, PrismaClient, SongsCollection} from '@prisma/client'

const prisma = new PrismaClient()

export async function findAllSongsCollections(): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany({
        include: {
            songs: true
        }
    })
}

export async function findSongsCollectionById(collectionId: bigint): Promise<SongsCollection | null> {
    return prisma.songsCollection.findFirst({
        where: {
            id: collectionId,
        },
        include: {
            songs: true
        }
    })
}

export async function findSongsCollectionsFromCreator(creatorId: bigint): Promise<SongsCollection[]> {
    return prisma.songsCollection.findMany({
        where: {
            creatorId: creatorId
        },
        include: {
            songs: true
        }
    })
}

export async function findSongsCollectionByIdAndCreatorId(collectionId: bigint, creatorId: bigint): Promise<SongsCollection | null> {
    return prisma.songsCollection.findFirst({
        where: {
            id: collectionId,
            creatorId: creatorId
        },
        include: {
            songs: true
        }
    })
}

export async function findSongsCollectionsByContentType(collectionType: ContentType): Promise<SongsCollection[]> {
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

export async function createSongsCollection(collection: Prisma.SongsCollectionCreateInput, creatorId: bigint): Promise<SongsCollection> {
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

export async function updateSongsCollections(id: bigint, updateData: Prisma.SongsCollectionUpdateInput): Promise<SongsCollection> {
    return prisma.songsCollection.update({
        where: {
            id: id
        }, data: {
            name: updateData.name,
            description: updateData.description
        }
    })
}

export async function deleteSongsCollectionById(collectionId: bigint): Promise<SongsCollection | null> {
    return prisma.songsCollection.delete({
        where: {
            id: collectionId
        }
    })
}