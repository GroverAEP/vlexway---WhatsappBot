import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';

export async function sendVideo(jid, filePath, caption = "") {
    if (!globalThis.sock) throw new Error("sock no inicializado");

    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) throw new Error("Video no encontrado: " + absolutePath);

    const buffer = fs.readFileSync(absolutePath);
    const fileName = path.basename(absolutePath);

    try {
        // Subir media SIN thumbnail (WhatsApp lo genera auto)
        const media = await prepareWAMessageMedia(
            { 
                video: buffer,
                mimetype: "video/mp4",
                fileName
            },
            { upload: globalThis.sock.waUploadToServer }
        );

        // Crear y enviar mensaje (con relay para estabilidad)
        const content = {
            videoMessage: {
                ...media.videoMessage,
                caption: caption || "",
                // Sin jpegThumbnail: WA lo hace solo
            }
        };

        const msg = generateWAMessageFromContent(jid, content, {});
        const sentKey = await globalThis.sock.relayMessage(jid, msg.message, { messageId: msg.key.id });

        // Log simple (sin esperar ACK por ahora, para evitar más complejidad)
        console.log("✅ Video enviado al servidor:", fileName);
        
        // Opcional: Envía un texto confirmando para debug
        await globalThis.sock.sendMessage(jid, { text: "Video PokeApi.mp4 enviado! Revisa si aparece." });

    } catch (err) {
        console.error("❌ Error:", err.message);
        throw err;
    }
}