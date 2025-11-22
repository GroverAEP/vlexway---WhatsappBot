import { exec } from "child_process";
import path from "path";
import fs from "fs-extra";

export async function downloadYoutubeVideo(url) {
    return new Promise(async (resolve, reject) => {
        try {
            // Carpeta de descarga
            const outputDir = path.join(process.cwd(), "./src/media/video");
            await fs.ensureDir(outputDir);

            // Nombre único
            const outputPath = path.join(outputDir, `video_${Date.now()}.mp4`);

            // Comando para descargar
            const cmd = `yt-dlp -f "best[ext=mp4]/best" -o "${outputPath}" ${url}`;

            console.log("Ejecutando:", cmd);

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error("Error al descargar:", error);
                    return reject(error);
                }

                console.log("yt-dlp output:", stdout);

                // Validar que se descargó
                if (fs.existsSync(outputPath)) {
                    resolve(outputPath);
                } else {
                    reject("No se encontró el archivo descargado.");
                }
            });

        } catch (err) {
            reject(err);
        }
    });
}