import {AccessType, ContentType, Prisma, SongsCollection} from "@prisma/client";
import {
    addSongToSongsCollection,
    createSongsCollection,
    deleteSongFromSongsCollection,
    deleteSongsCollectionById,
    findSongsCollectionById,
    findSongsCollectionByIdAndCreatorId,
    findSongsCollectionsByContentType,
    findSongsCollectionsFromCreator,
    updateSongsCollectionAccessType,
    updateSongsCollections
} from "../repositories/songsCollectionRepository";
import {ResponseError} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {findSongById} from "../repositories/songsRepository";
import {countShareByContentIdAndContentType} from "../repositories/sharedContentRepository";

export async function getSongsCollectionsData(collectionType: string): Promise<SongsCollection[]> {
    const typeUpperCase: string | null = collectionType ? collectionType.toUpperCase() : null
    if (typeUpperCase !== ContentType.PLAYLIST && typeUpperCase !== ContentType.ALBUM && typeUpperCase !== 'ALL') {
        throw new ResponseError(400, 'invalid collection type')
    }

    const type = typeUpperCase == 'ALL' ? undefined : typeUpperCase
    return await findSongsCollectionsByContentType(type)
}

export async function getSongsCollectionDataById(collectionId: bigint): Promise<SongsCollection | null> {
    return await findSongsCollectionById(collectionId)
}

export async function getSongsCollectionsDataFromCreator(creatorId: bigint, contentType?: ContentType): Promise<SongsCollection[]> {
    return await findSongsCollectionsFromCreator(creatorId, contentType)
}

export async function addSongsCollection(requestBody: any, creatorId: bigint) {
    validateSongsCollection(requestBody.type, requestBody.access)

    const collection: Prisma.SongsCollectionCreateInput = {
        name: requestBody.name,
        description: requestBody.description,
        type: requestBody.type,
        access: requestBody.access,
    }

    try {
        return await createSongsCollection(collection, creatorId)
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            throw new ResponseError(400, e.message)
        }
        throw new ResponseError(500)
    }
}

export async function updateSongsCollection(data: any, creatorId: bigint) {
    if (data.id == undefined) {
        throw new ResponseError(400, `invalid collection id (id: ${data.id})`)
    }
    const updatedCollection = await findSongsCollectionByIdAndCreatorId(data.id, creatorId)
    if (!updatedCollection) {
        throw new ResponseError(404, 'songs collection not found')
    }

    const updateData: Prisma.SongsCollectionUpdateInput = {
        name: data.name,
        description: data.description
    }
    return await updateSongsCollections(data.id, updateData)
}

export async function setSongsCollectionAccessType(collectionId: bigint, accessType: AccessType, creatorId: bigint) {
    let updatedSongsCollection: SongsCollection | null
    if (accessType === AccessType.PUBLIC) {
        updatedSongsCollection = await updateSongsCollectionAccessType(collectionId, AccessType.PUBLIC, creatorId)
    } else if (await countShareByContentIdAndContentType(collectionId, ContentType.SONG)) {
        updatedSongsCollection = await updateSongsCollectionAccessType(collectionId, AccessType.SHARED, creatorId)
    } else {
        updatedSongsCollection = await updateSongsCollectionAccessType(collectionId, AccessType.PRIVATE, creatorId)
    }
    if (!updatedSongsCollection) {
        throw new ResponseError(404, 'songs collection not found')
    }
    return updatedSongsCollection
}

export async function addSongToPlaylist(songId: bigint, playlistId: bigint, userId: bigint) {
    if (!(await findSongById(songId))) {
        throw new ResponseError(404, 'song not found')
    }

    if (!(await addSongToSongsCollection(songId, playlistId, userId))) {
        throw new ResponseError(404, 'playlist not found')
    }
}

export async function removeSongFromPlaylist(songId: bigint, playlistId: bigint, userId: bigint) {
    if (!(await findSongById(songId))) {
        throw new ResponseError(404, 'song not found')
    }

    if (!(await deleteSongFromSongsCollection(songId, playlistId, userId))) {
        throw new ResponseError(404, 'playlist not found')
    }
}

export async function deleteSongsCollection(collectionId: bigint, creatorId: bigint) {
    if (!(await findSongsCollectionByIdAndCreatorId(collectionId, creatorId))) {
        throw new ResponseError(404, 'songs collection not found')
    }
    return await deleteSongsCollectionById(collectionId)
}

function validateSongsCollection(collectionType: string, accessType: string): void {
    let errors: string[] = []
    let errorMessage: string = 'invalid fields: '

    if (collectionType !== ContentType.PLAYLIST && collectionType !== ContentType.ALBUM) {
        errors.push('type')
    }
    if (accessType === AccessType.SHARED) {
        errors.push('access')
    }

    if (errors.length != 0) {
        throw new ResponseError(400, errorMessage.concat(errors.join(',')))
    }
}