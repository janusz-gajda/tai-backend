import {spawnSync} from "node:child_process";
import {ResponseError} from "./response";
import {IPicture} from "music-metadata";
import fs from "fs";

export function convertMp3ToAac(fileName: string, songId: bigint) {
    const newFilePath: string = `./songs/${songId}/`
    if (!fs.existsSync(newFilePath)) {
        fs.mkdirSync(newFilePath)
    }
    const response = spawnSync('python', [
        './src/utils/convert_audio.py',
        './songs/tmp/'.concat(fileName),
        newFilePath,
    ])
    if (response.status != 0) {
        throw new ResponseError()
    }
}

export function saveCoverFromMp3(img: IPicture | undefined, path: string) {
    if (img) {
        fs.writeFileSync(path.concat('/cover.png'), img.data)
    }
}

export function deleteTmpFiles(tmpDirectory: string) {
    const files: string[] = fs.readdirSync(tmpDirectory)
    files.forEach(file => fs.rmSync(tmpDirectory.concat(`/${file}`)))
}