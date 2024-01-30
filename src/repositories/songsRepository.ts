import {Prisma, PrismaClient, Song} from "@prisma/client";

const prisma = new PrismaClient()

export async function addSong(songData: Prisma.SongCreateInput): Promise<Song> {
    return prisma.song.create({
        data: songData
    });
}