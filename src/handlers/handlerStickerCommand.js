import fs from 'fs'
// import ffmpeg from 'fluent-ffmpeg'
import sharp from 'sharp'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

// Configurar ffmpeg path correcto
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// import { Sticker, StickerTypes } from 'wa-sticker-formatter'



//////////////////////////////////////////////////
// Cuarto Comando : Sticker
// Uso: Creacion de Stickers de Imagenes y Videos
// Problema: El video no tiene resolucion automatica
//////////////////////////////////////////////////


export async function handleStickerCommand({sock,msg,sender,text}) {
  if (text === '!s' || text === '!sticker') {

    let mediaMsg = await extractMedia(msg);

    // ⚠️ Validación inicial
    if (!mediaMsg) {
      await sock.sendMessage(sender, {
        text: '❌ Envía o responde a una imagen o video (mp4, mov, mkv, webm) con el comando *!sticker*'
      })
      return;
    }
    console.log(msg)
    console.log(mediaMsg)

    console.log('🟡 Media detectada →', Object.keys(mediaMsg)[0])

    try {
      // 📥 Descargar el archivo multimedia
      const buffer = await downloadMediaMessage(
        { message: mediaMsg },
        'buffer',
        {},
        { logger: console }
      )

      if (!buffer || buffer.length < 1000) {
        throw new Error('⚠️ Buffer vacío o corrupto.')
      }

          // 📂 Rutas temporales
      const tempFolder = path.join(process.cwd(), "temp");
      const tempInput = path.join(tempFolder, "input.webp");
      const tempOutput = path.join(tempFolder, "sticker.webp");

    // Crear carpeta temp si no existe
      await fs.promises.mkdir(tempFolder, { recursive: true });

      // Limpiar archivos previos
      try { await fs.promises.unlink(tempInput); } catch {}
      try { await fs.promises.unlink(tempOutput); } catch {}
      // const tempInput = './src/temp_input'
      // const tempOutput = './src/sticker.webp'
      const isVideo =
        mediaMsg.videoMessage ||
        mediaMsg.mimetype?.includes('video') ||
        mediaMsg.mimetype?.includes('mp4') ||
        mediaMsg.mimetype?.includes('webm') ||
        mediaMsg.mimetype?.includes('mov') ||
        mediaMsg.mimetype?.includes('mkv')

      const inputPath = isVideo ? `${tempInput}.mp4` : `${tempInput}.jpg`
      fs.writeFileSync(inputPath, buffer)

      if (isVideo) {
        // 🎬 Conversión de video → sticker animado
        console.log('🎞️ Procesando video para sticker...')
        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .inputFormat('mp4')
            .duration(6) // máximo 6 segundos
            .noAudio()
            .outputOptions([
              '-vf',
              'scale=512:512:force_original_aspect_ratio=decrease,fps=15,format=rgba',
              '-loop', '0'
            ])
            .output(tempOutput)
            .on('end', resolve)
            .on('error', reject)
            .run()
        })
      } else {
        // 🖼️ Imagen → Sticker
        console.log('🖼️ Procesando imagen para sticker...')

          let safeBuffer = buffer;
              try {
                  await sharp(buffer)
                  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
                  .toFormat("webp", { quality: 95, lossless: true })
                  .toFile(tempOutput);
              } catch (err) {
                  console.warn("⚠️ Sharp detectó problema. Reintentando con buffer crudo...");
                  safeBuffer = Buffer.from(buffer);
                  await sharp(safeBuffer)
                  .resize(512, 512)
                  .toFormat("webp")
                  .toFile(tempOutput);
              }
              }

      // 📌 Confirmar que el archivo realmente existe
      if (!fs.existsSync(tempOutput)) {
        throw new Error("❌ No se generó el archivo sticker.webp");
      }
      
      console.log(tempOutput, fs.existsSync(tempOutput))

      // 📤 Enviar sticker al usuario
      await sock.sendMessage(sender, {
        sticker: fs.readFileSync(tempOutput),

      }, { quoted: msg })

      console.log('✅ Sticker enviado correctamente')

      // 🧹 Limpiar archivos temporales (1 segundo después)
      setTimeout(() => {
        try {
          if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput)
          if (fs.existsSync(`${tempInput}.jpg`)) fs.unlinkSync(`${tempInput}.jpg`)
          if (fs.existsSync(`${tempInput}.mp4`)) fs.unlinkSync(`${tempInput}.mp4`)
          console.log('🧹 Archivos temporales eliminados')
        } catch (delErr) {
          console.warn('⚠️ Error al eliminar archivos temporales:', delErr)
        }
      }, 1000)
    } catch (err) {
      console.error('❌ Error al crear sticker:', err)
      await sock.sendMessage(sender, {
        text: '⚠️ Error al crear el sticker. Asegúrate de que el video dure menos de 6 segundos o que la imagen sea válida.'
      })
    }
    }
}

async function  extractMedia(msg) {
  try{
    // 1️⃣ Ver una vez (viewOnceMessage o viewOnceMessageV2)
    if (msg.message.viewOnceMessage?.message) {
      const inner = msg.message.viewOnceMessage.message
      if (inner.imageMessage || inner.videoMessage) return inner
    }
  
    // 2️⃣ Imagen o video normal
    if (msg.message.imageMessage || msg.message.videoMessage) {
      return msg.message
    }
  
    // 3️⃣ Si responde a otro mensaje
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage
    if (quoted) {
      if (quoted.viewOnceMessage?.message) {
        const inner = quoted.viewOnceMessage.message
        if (inner.imageMessage || inner.videoMessage) return inner
      }
      if (quoted.imageMessage || quoted.videoMessage) return quoted
    }
  
    // 4️⃣ Si solo hay contexto (por ejemplo, reenviado)
    if (msg.message.messageContextInfo?.quotedMessage) {
      const quoted = msg.message.messageContextInfo.quotedMessage
      if (quoted.viewOnceMessage?.message) {
        const inner = quoted.viewOnceMessage.message
        if (inner.imageMessage || inner.videoMessage) return inner
      }
      if (quoted.imageMessage || quoted.videoMessage) return quoted
    }
  
    return null
  } catch (err){
    console.error('❌ Error al crear sticker:', err)
    await sock.sendMessage(sender, {
      text: '⚠️ Error el mensaje no llego.'
    })
  }
}