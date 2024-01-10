import {AccessType, ContentType, Prisma, SongsCollection} from "@prisma/client";
import {
    createSongsCollection,
    findAllCollections,
    findCollectionsByContentType
} from "../repositories/songsCollectionRepository";
import {ResponseError} from "../utils/response";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

export async function getCollectionsData(collectionType: string): Promise<SongsCollection[] | null> {
    if (collectionType === ContentType.PLAYLIST || collectionType === ContentType.ALBUM) {
        return await findCollectionsByContentType(collectionType)
    }
    if (collectionType === 'ALL') {
        return await findAllCollections()
    }
    return null
}

export async function addCollection(requestBody: any, creatorId?: bigint) {
    validateCollection(requestBody.type, requestBody.access)

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

export function validateCollection(collectionType: string, accessType: string): void {
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