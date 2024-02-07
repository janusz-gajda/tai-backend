import {AccessType, ContentType, Song, SongsCollection} from "@prisma/client";
import {ResponseError} from "../utils/response";
import {
    findSongsCollectionByIdAndCreatorId,
    updateSongsCollectionAccessType
} from "../repositories/songsCollectionRepository";
import {findSongByIdAndAddingUserId, updateSongAccessType} from "../repositories/songsRepository";
import {findUserByName} from "../repositories/userRepository";
import {
    addNewSharedContentEntry,
    countShareByContentIdAndContentType,
    deleteSharedContentEntry
} from "../repositories/sharedContentRepository";


export async function shareContent(contentId: bigint, contentType: ContentType, recipientName: string, sharingUserId: bigint) {
    const contentToShare: SongsCollection | Song = await getContent(contentId, contentType, sharingUserId)
    const recipient = await findUserByName(recipientName)
    if (!recipient) {
        throw new ResponseError(404, 'recipient not found')
    }

    const sharedContentData = {
        recipientId: recipient.id,
        contentId: contentId,
        contentType: contentType
    }

    await addNewSharedContentEntry(sharedContentData)
    await updateAccessToContent(contentToShare, contentType)
}

export async function unshareContent(contentId: bigint, contentType: ContentType, recipientName: string, sharingUserId: bigint) {
    const contentToShare: SongsCollection | Song = await getContent(contentId, contentType, sharingUserId)
    const recipient = await findUserByName(recipientName)
    if (!recipient) {
        throw new ResponseError(404, 'recipient not found')
    }

    const sharedContentData = {
        recipientId: recipient.id,
        contentId: contentId,
        contentType: contentType
    }

    await deleteSharedContentEntry(sharedContentData)
    await updateAccessToContent(contentToShare, contentType)
}

async function getContent(contentId: bigint, contentType: ContentType, sharingUserId: bigint): Promise<SongsCollection | Song> {
    let contentToShare: SongsCollection | Song | null
    if (contentType === ContentType.PLAYLIST) {
        contentToShare = await findSongsCollectionByIdAndCreatorId(contentId, sharingUserId)
    } else if (contentType === ContentType.SONG) {
        contentToShare = await findSongByIdAndAddingUserId(contentId, sharingUserId)
    } else {
        throw new ResponseError(400, 'invalid content type')
    }
    if (!contentToShare) {
        throw new ResponseError(404, 'could not find content to share')
    }
    return contentToShare
}

async function updateAccessToContent(content: Song | SongsCollection, contentType: ContentType) {
    if (content.access === AccessType.PRIVATE) {
        await updateContentAccessType(content.id, contentType, AccessType.SHARED)
    } else if (content.access === AccessType.SHARED) {
        const count = await countShareByContentIdAndContentType(content.id, contentType)
        if (count == 0) {
            await updateContentAccessType(content.id, contentType, AccessType.PRIVATE)
        }
    }
}

async function updateContentAccessType(contentId: bigint, contentType: ContentType, newAccessType: AccessType) {
    if (contentType === ContentType.SONG) {
        await updateSongAccessType(contentId, newAccessType)
    } else if (contentType === ContentType.PLAYLIST) {
        await updateSongsCollectionAccessType(contentId, newAccessType)
    }
}
