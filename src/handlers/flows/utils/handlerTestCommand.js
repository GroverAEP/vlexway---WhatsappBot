// import { sendVideo } from "../../../index.js";
import { downloadBiliVideo } from "../../../services/BilibiliServices/getVideo.js";
import { downloadYoutubeMp3 } from "../../../services/youtubeServices/getMp3Url.js";
import { downloadYoutubeVideo } from "../../../services/youtubeServices/getVideoUrl.js";
import { IMAGE, VIDEO } from "../../../utils/config.js";
import { deleteFile } from "../../../utils/deleteFile.js";
import fs from "fs";
import path from "path";
import { sendVideo } from "../../events/sendMultimedia.js";


export const handlerTestCommand = {
    name: "test",
    role: "all",
    run: async ({ msg, text, client,sock }) => {
        try {
            const sender = msg.key.participant || msg.key.remoteJid;
            console.log(sender)
            const pushName = msg.pushName || 'Usuario';
            const prefix = client.config.defaults.prefix;

            // Comando !hola
            if (text === `${prefix}hola`) {
                await client.send.reply(msg, `👋 ¡Hola! ${pushName} Soy un bot TCG Pokemon 🐱‍💻`);
            }

            // Comando !explote o !e
            if (text === `${prefix}e` || text === `${prefix}explote`) {
                const msgExplote = await client.send.reply(msg, 'Este mensaje va a explotar en 10 segundos!');
                setTimeout(async () => {
                    await client.sock.sendMessage(sender, { delete: msgExplote.key });
                }, 10000);
            }

            // Comando !say
            if (text.startsWith(`${prefix}say`)) {
                const match = text.match(/^!say\s+(.+)/);
                if (match) {
                    await client.send.reply(msg, `${pushName}: ${match[1]}`);
                } else {
                    await client.send.reply(msg, `El comando necesita que definas el texto: ${prefix}say {texto}`);
                }
            }

        //         // Comando !v
        //         if (text === "!v") {
        //    await sock.sendMessage(sender,{
        //                 video: {url:`${VIDEO}PokeApi.mp4`},
        //                 caption: "Un video para aprender PokeApi node.js"
        //             }) }

                    
                // // Comando !v
                // if (text === "!v") {
                // // 1. Lees el video del disco
                // const buffer = fs.readFileSync("./src/media/video/PokeApi.mp4");

                // // 2. Preparas el contenido del mensaje (el video + caption)
                // const content = {
                //     videoMessage: {
                //         video: {url:"./src/media/video/PokeApi.mp4"},           // ← el archivo en bytes
                //         mimetype: "video/mp4",
                //         caption: "Video con relay fix"
                //     }
                // };

                // // 3. Aquí creas el mensaje "oficial" de WhatsApp
                // //    msg.key.remoteJid = el chat donde llegó el comando (grupo o privado)
                // const preparedMsg = generateWAMessageFromContent(msg.key.remoteJid, content, {});

                // // 4. Envías el mensaje usando relayMessage (el único que funciona 100% en 2025)
                // await sock.relayMessage(msg.key.remoteJid, preparedMsg.message, {
                //     messageId: preparedMsg.key.id
                // });

                // console.log("Video enviado correctamente con relayMessage");
                // }


                //     try {
                //         // Ruta al video
                //         const filePath = path.join(
                //             client.config.routes.PATH_VIDEO,
                //             "PokeApi.mp4"
                //         );

                //         const absolutePath = path.resolve(filePath);

                //         // Verificar que exista
                //         if (!fs.existsSync(absolutePath)) {
                //             console.error("❌ Video no encontrado:", absolutePath);
                //             await client.send.reply(msg, "❌ No encontré el video PokeApi.mp4");
                //             return;
                //         }

                //         // Leer archivo como BUFFER (IMPORTANTE)
                //         const videoBuffer = fs.readFileSync(absolutePath);

                //         console.log("➡ ENVIANDO VIDEO:", absolutePath);

                //         // Enviar video correctamente a WhatsApp
                //         await sock.sendMessage(sender, {
                //             video: videoBuffer,        // ← Buffer real obligatorio
                //             mimetype: "video/mp4",
                //             fileName: "PokeApi.mp4",
                //             caption: "Un video para aprender PokeApi con Node.js"
                //         });
                //     //   await sendVideo(sender, absolutePath, "Un video para aprender PokeApi");


                //     } catch (error) {
                //         console.error("❌ Error enviando video:", error);
                //         await client.send.reply(msg, "❌ Error enviando video.");
                //     }
                // }
            // Comando !yt
            if (text.startsWith(`${prefix}yt`)) {
                const parts = text.split(" ");
                if (parts.length === 1) {
                    await client.send.reply(msg, "Comando no disponible");
                } else {
                    const url = parts[1];
                    await client.send.reply(msg, "📥 Descargando video, espera...");
                    try {
                        const { outputPath, json } = await downloadYoutubeVideo(url);
                        // await client.sock.sendMessage(sender, {
                        //     video: { url: outputPath },
                        //     mimetype: "video/mp4",
                        //     caption: `| Video de YouTube | \n- Nombre: ${json.title} 🎬`
                        // });
                      await multimedia.sendVideo(sender, filePath, "Un video para aprender PokeApi");
                        // Limpieza si quieres
                        // setTimeout(() => deleteFile(outputPath), 5000);
                    } catch (err) {
                        await client.send.reply(msg, "❌ Error al descargar el video.");
                        console.error(err);
                    }
                }
            }

            // // Comando !mp3
            // if (text.startsWith(`${prefix}mp3 `)) {
            //     const query = text.slice(`${prefix}mp3 `.length).trim();
            //     if (!query) return await client.send.reply(msg, "❌ Debes escribir un enlace o nombre de canción.");
            //     await client.send.reply(msg, "📥 Descargando Audio, espera...");
            //     try {
            //         const filePath = await downloadYoutubeMp3(query);
            //         // await client.send.audio(sender,filePath,msg);
                    

            //         return await sock.sendMessage(jid, {
            //             audio: typeof filePath === 'string' ? { url: filePath } : filePath,
            //             mimetype: 'audio/mp4', // o 'audio/mpeg' según el tipo de archivo
            //             ptt: true // si quieres que se envíe como nota de voz
            //         }, { quoted });

            //         setTimeout(() => deleteFile(filePath), 5000);
            //     } catch (err) {
            //         await client.send.reply(msg, `❌ Error al descargar el audio. ${err}`);
            //         console.error(err);
            //     }
            // }

            // Comando !bl
            if (text.startsWith(`${prefix}bl `)) {
                const query = text.slice(`${prefix}bl `.length).trim();
                if (!query) return await client.send.reply(msg, "❌ Debes escribir un enlace o nombre de video.");
                await client.send.reply(msg, "📥 Descargando video, espera...");
                try {
                    const filePath = await downloadBiliVideo(query);
                    await client.sock.sendMessage(sender, {
                        video: { url: filePath },
                        mimetype: "video/mp4",
                        caption: "Aquí está tu video de BiliBili 🎬"
                    });
                    // setTimeout(() => deleteFile(filePath), 5000);
                } catch (err) {
                    await client.send.reply(msg, `❌ Error al descargar el video. ${err}`);
                    console.error(err);
                }
            }

            // Comando NSFW ejemplo
            if (text === `${prefix}r34`) {
                // await handleRule34(client, msg, sender, text);
                await client.send.reply(msg, "Comando NSFW (r34) ejecutado.");
            }

        } catch (error) {
            console.error("Error en handlerTestCommand:", error);
        }
    }
};