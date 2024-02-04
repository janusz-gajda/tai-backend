import {ContentType, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export async function addNewSharedContentEntry(data: any) {
    return prisma.sharedContent.create({
        data: {
            recipientId: data.recipientId,
            contentId: data.contentId,
            contentType: data.contentType
        }
    })
}

export async function countShareByContentIdAndContentType(contentId: bigint, contentType: ContentType) {
    return prisma.sharedContent.count({
        where: {
            contentId: contentId,
            contentType: contentType
        }
    })
}

export async function deleteSharedContentEntry(data: any) {
    return prisma.sharedContent.delete({
        where: {
            recipientId_contentId: {
                contentId: data.contentId,
                recipientId: data.recipientId
            },
            contentType: data.contentType,
        }
    })
}