import {AccessType, ContentType, Prisma, SongsCollection} from "@prisma/client";
import {
    createSongsCollection,
    deleteSongsCollectionById,
    findAllSongsCollections,
    findSongsCollectionById,
    findSongsCollectionByIdAndCreatorId,
    findSongsCollectionsByContentType,
    findSongsCollectionsFromCreator,
    updateSongsCollections
} from "../repositories/songsCollectionRepository";
import {ResponseError} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

export async function getSongsCollectionsData(collectionType: string): Promise<SongsCollection[] | null> {
    const typeUpperCase = collectionType.toUpperCase()
    if (typeUpperCase === ContentType.PLAYLIST || typeUpperCase === ContentType.ALBUM) {
        return await findSongsCollectionsByContentType(typeUpperCase)
    }
    if (typeUpperCase == 'ALL') {
        return await findAllSongsCollections()
    }
    return null
}

export async function getSongsCollectionDataById(collectionId: bigint): Promise<SongsCollection | null> {
    return await findSongsCollectionById(collectionId)
}

export async function getSongsCollectionsDataFromCreator(creatorId: bigint): Promise<SongsCollection[]> {
    return await findSongsCollectionsFromCreator(creatorId)
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
        return null
    }

    const updateData: Prisma.SongsCollectionUpdateInput = {
        name: data.name,
        description: data.description
    }
    return await updateSongsCollections(data.id, updateData)
}

export async function deleteSongsCollection(collectionId: bigint) {
    if (!(await findSongsCollectionById(collectionId))) {
        return null
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