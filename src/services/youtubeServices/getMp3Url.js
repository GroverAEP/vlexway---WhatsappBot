import { cleanYoutubeUrl  } from "../../utils/cleanUrl.js";
import { exec } from "child_process";

import path from "path";
import fs from "fs-extra";


export async function downloadYoutubeMp3(query) {
    return new Promise(async (resolve, reject) => {
        try {

                        // Detectar si es URL o búsqueda
            const isUrl = query.startsWith("http://") || query.startsWith("https://");

            // Si no es URL, convertir en búsqueda de YouTube
            const finalQuery = isUrl ? query : `"ytsearch1:${query}"`;
            
            const cleanUrl = isUrl ? cleanYoutubeUrl(finalQuery) : finalQuery;


            // Carpeta de descarga
            const outputDir = path.join(process.cwd(), "./src/media/audio");
            await fs.ensureDir(outputDir);

            // Nombre único
            const outputPath = path.join(outputDir, `audio_${Date.now()}.mp3`);

            // yt-dlp comando MP3
            const cmd = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" ${cleanUrl}`;
            
            
            console.log("Ejecutando:", cmd);

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error("Error al descargar:", error);
                    return reject(error);
                }

                console.log("yt-dlp output:", stdout);

                if (fs.existsSync(outputPath)) {
                    resolve(outputPath);
                } else {
                    reject("No se encontró el archivo mp3 descargado.");
                }
            });

        } catch (err) {
            reject(err);
        }
    });
}
