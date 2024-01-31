import {AccessType, Prisma, PrismaClient, Song} from "@prisma/client";

const prisma = new PrismaClient()

export async function addSong(songData: Prisma.SongCreateInput): Promise<Song> {
    return prisma.song.create({
        data: songData
    });
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