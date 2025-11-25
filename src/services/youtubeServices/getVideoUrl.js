import { exec } from "child_process";
import path from "path";
import fs from "fs-extra";

import { cleanYoutubeUrl } from "../../utils/cleanUrl.js";

export async function downloadYoutubeVideo(query) {
    return new Promise(async (resolve, reject) => {
        try {

                        // Detectar si es URL o búsqueda
            const isUrl = query.startsWith("http://") || query.startsWith("https://");

            // Si no es URL, convertir en búsqueda de YouTube
            const finalQuery = isUrl ? query : `"ytsearch1:${query}"`;
            
            const cleanUrl = isUrl ? cleanYoutubeUrl(finalQuery) : finalQuery;

            // Carpeta de descarga
            const outputDir = path.join(process.cwd(), "./src/media/video");
            await fs.ensureDir(outputDir);

            // Nombre único
            const outputPath = path.join(outputDir, `video_${Date.now()}.mp4`);

            // Comando para descargar
            const cmd = `yt-dlp --print-json -f "best[ext=mp4]/best" -o "${outputPath}" "${cleanUrl}"`;

            console.log("Ejecutando:", cmd);

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error("Error al descargar:", error);
                    return reject(error);
                }

                console.log("yt-dlp output:", stdout);

                // Validar que se descargó
                if (fs.existsSync(outputPath)) {
                    // resolve(outputPath);

                const jsonInfo = JSON.parse(stdout);

                resolve(
                    {
                    outputPath,
                    body: jsonInfo
                    }                    
                );

                // // Buscar un formato MP4 con video y audio
                // const format = json.formats.find(f => 
                //     f.ext === "mp4" && 
                //     f.vcodec !== "none" && 
                //     f.acodec !== "none"
                // );

                // if (!format) {
                //     return reject("No se encontró un formato MP4 con audio y video.");
                // }

                // resolve(format.url);

                // json.add(format.url)

            

                } else {
                    reject("No se encontró el archivo descargado.");
                }
            });

        } catch (err) {
            reject(err);
        }
    });
}