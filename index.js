import makeWASocket, { useMultiFileAuthState,  downloadMediaMessage
, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import fs from 'fs-extra'
import sharp from 'sharp'
// import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
// import ffmpeg from 'fluent-ffmpeg'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import pino from "pino"



// import { utilsCommand } from './utilsCommand.js'
// import { handletoImage } from "./utils/toImage.js"
// import { handletoVideo } from "./utils/toVideo.js"

// import { fetchRule34 } from './r34Search.js'

import path from "path";
import { handleStickerCommand } from './src/handlers/handlerStickerCommand.js'
import { handlerGameCommand } from './src/handlers/handlerGameCommand.js'
import { handleQrCommand } from './src/handlers/handlerQr.js'
import { handlerPokemonApi } from './src/handlers/handlerPokemonApi.js'
import { handleRandomCommand } from './src/handlers/handlerRandomComand.js'
import { handleAdminCommand } from './src/handlers/handlerAdminCommand.js'
import { menuManager } from './src/utils/menuManager.js'
import { menuOffChat } from './src/utils/menuOffChatjs'


// ffmpeg.setFfmpegPath(ffmpegInstaller.path)

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./src/auth')
  const { version } = await fetchLatestBaileysVersion()
  const deletedMessages = {}; 


  const sock = makeWASocket({
    version,
    auth: state,
    browser: ['Bot', 'Chrome', '1.0.0'],
    // logger: pino({ level: "silent" }),
  })
  // ==================== CONEXIÓN ====================
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    // Mostrar QR si aparece
    if (qr) {
      console.log('📱 Escanea este código QR:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado correctamente a WhatsApp')
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      console.log('❌ Conexión cerrada. Código:', code)

      // Si el código no es 401, intentamos reconectar
      if (code !== 401) {
        console.log('🔄 Intentando reconectar...')
        startBot()
      } else {
        console.log('🚫 Sesión inválida. Borra la carpeta "session" y vuelve a escanear el QR.')
      }
    }
  })

  sock.ev.on('creds.update', saveCreds)


// ==================== ANTI-DELETE ====================
  sock.ev.on("messages.update", async (updates) => {
        try {
                  // evita loop infinito
                  console.log("messages_updates")
                  console.log(updates)


        // if (!allowedChats.has(chatId)) {
        
        // }

        for (const u of updates) {

            // ❗ Ignorar si el mensaje NO es de un grupo
            if (!u.key.remoteJid.endsWith("@g.us")) continue;
            
            // ! Ignorar si el mensaje Es de un
            if (u.key.remoteJid === "status@broadcast") continue;

            // ❗ Ignorar mensajes propios
            if (u.key.fromMe) continue;
            
            console.log(!u.key.remoteJid.endsWith("@g.us"))
            console.log(u.key.remoteJid === "status@broadcast")
            console.log(u.key.fromMe)


              // if (u.key.fromMe) continue;

                // if (u.update?.message == null) { // MESSAGE_REVOKED
                //    const msgId = u.key.id;  
                //     const chatId = u.key.remoteJid
                //     const user = u.key.participant || u.key.remoteJid

                //     const originalMsg = deletedMessages[msgId]

                //     if (!originalMsg) {
                //         await sock.sendMessage(chatId, {
                //             text: `🗑 Alguien eliminó un mensaje, pero no pude recuperarlo.${msgId}`
                //         })
                //         return
                //     }

                //     const m = originalMsg.message
                //     let deletedContent = "(Contenido no reconocido)"

                //     if (!m) deletedContent = "(Mensaje vacío)"
                //     else if (m.conversation) deletedContent = m.conversation
                //     else if (m.extendedTextMessage?.text) deletedContent = m.extendedTextMessage.text
                //     else if (m.imageMessage) deletedContent = "(Imagen eliminada)"
                //     else if (m.videoMessage) deletedContent = "(Video eliminado)"
                //     else if (m.stickerMessage) deletedContent = "(Sticker eliminado)"
                //     else if (m.audioMessage) deletedContent = "(Audio eliminado)"

                //     await sock.sendMessage(chatId, {
                //         text: `⚠️ *Mensaje eliminado detectado*\n👤 ${user}\n🗑 *Contenido:* ${deletedContent}`
                //     })
                // }
            }
        } catch (err) {
            console.error("❌ Error detectando mensaje eliminado:", err)
        }
    })

  const processedMessages = new Set();
  const allowedChats = new Set();
  const enableChat = (chatId) => {
      allowedChats.add(chatId);
      console.log("Chat habilitado:", chatId);
  };

  const blockAllGroups = async (sock) => {
      const groups = await sock.groupFetchAllParticipating();

      Object.values(groups).forEach(g => {
          // NO se añaden a allowedChats, por lo tanto quedan bloqueados
          console.log(`Grupo bloqueado por defecto: ${g.subject} (${g.id})`);
      });

      console.log("Todos los grupos iniciaron BLOQUEADOS.");
  };


  // Escuchar mensajes
  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
  
       
      console.log(messages)
      const msg = messages[0]

      const chatId = msg.key.remoteJid;
       
        // Si NO es un grupo, ignorarlo también (opcional)
        if (!chatId.endsWith("@g.us")) return;

        // 1️⃣ Verificar si ya procesaste este mensaje
        if (!msg?.key?.id) return;  

        if (processedMessages.has(msg.key.id)) {
            console.log("Mensaje repetido, ignorado:", msg.key.id);
            return; // ❗ Detener ejecución
        }

        // 2️⃣ Marcar como procesado
        processedMessages.add(msg.key.id);

        console.log("Mensaje nuevo:", msg);

        // Guardamos el mensaje con su ID
        deletedMessages[msg.key.id] = msg;

        await blockAllGroups(sock)

       // 2️⃣ Ignorar mensajes del propio bot
           if (msg.key.fromMe) return;

          if (!allowedChats.has(chatId)) {
              
              // Permitir comando para habilitar
              if (msg.message?.conversation?.toLowerCase() === "!start") {
                  // allowedChats.add(chatId) 
                  enableChat(chatId);
                  const metadata = await sock.groupMetadata(chatId);
          
                  await sock.sendMessage(chatId, {
                      text: `🤖 Bot activado en este chat. ${metadata.subject}`
                  });

                  return;
              }
              // await  menuOffChat(sock,sender,msg,allowedChats)
              return;
          }
       
        await menuManager(sock,msg,allowedChats)

        console.log("Mensaje recibido:", msg)
    } catch (err) {
        console.error("No se pudo descifrar mensaje:", err)
    }

  })





}

startBot()



export async function handleRule34(sock, msg, sender, text) {
  try {
        
      const tags = text.slice(5).trim().split(" ");
      if (tags.length === 0) {
          await sock.sendMessage(sender, {
        text: "⚠️ Debes escribir al menos un tag. Ejemplo:\n`!r34 catgirl`",
      });
      return;
    }

    await sock.sendMessage(sender, { text: "🔍 Buscando en Rule34..." });

    // const result = await fetchRule34(tags);
    if (!result) {
        await sock.sendMessage(sender, {
        text: "❌ No encontré resultados con esos tags. Intenta con otros.",
      });
      return;
    }

    // 🔹 Enviar imagen directamente
    const tempPath = path.join("./temp", `r34_${Date.now()}.jpg`);
    const response = await fetch(result.fileUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(tempPath, Buffer.from(buffer));

    await sock.sendMessage(sender, {
      image: fs.readFileSync(tempPath),
      caption: `🔞 Resultado Rule34\n🧩 Tags: ${tags.join(", ")}\n⭐ Score: ${result.score}`,
    });

    // 🧹 Limpieza
    setTimeout(() => {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }, 2000);
  } catch (err) {
    console.error("❌ Error en handleRule34:", err);
    await sock.sendMessage(sender, {
      text: "⚠️ Ocurrió un error al buscar en Rule34.",
    });

  }

}