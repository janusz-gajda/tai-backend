import {AccessType, Prisma, PrismaClient, Song} from "@prisma/client";

const prisma = new PrismaClient()

export async function findSongById(songId: bigint): Promise<Song | null> {
    return prisma.song.findFirst({
        where: {
            id: songId
        }
    })
}

export async function findSongByIdAndAddingUserId(songId: bigint, addingUserId: bigint): Promise<Song | null> {
    return prisma.song.findFirst({
        where: {
            id: songId,
            addingUserId: addingUserId
        }
    })
}

export async function addSong(songData: Prisma.SongCreateInput): Promise<Song> {
    return prisma.song.create({
        data: songData
    });
}

export async function updateSongAccessType(id: bigint, accessType: AccessType, userId?: bigint): Promise<Song | null> {
    return prisma.song.update({
        where: {
            id: id,
            addingUserId: userId
        },
        data: {
            access: accessType
        }
    })
}

export async function deleteSongById(songId: bigint): Promise<Song> {
    return prisma.song.delete({
        where: {
            id: songId
        }
    })
}

export async function songExists(title: string, author: string, addingUserId: bigint): Promise<Song | null> {
    return prisma.song.findFirst({
        where: {
            title: title,
            author: author,
            OR: [
                {access: AccessType.PUBLIC},
                {addingUserId: addingUserId}
            ]
        }
    })
}