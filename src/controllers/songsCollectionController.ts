import {ContentType, SongsCollection} from "@prisma/client";
import {findAllCollections, findCollectionsByContentType} from "../repositories/songsCollectionRepository";

export async function getCollectionsData(contentType: string): Promise<SongsCollection[] | null> {
    if (contentType === ContentType.PLAYLIST || contentType === ContentType.ALBUM) {
        return await findCollectionsByContentType(contentType)
    }
    if (contentType === 'ALL') {
        return await findAllCollections()
    }
    return null
}

export function addCollection() {

}