// src/handlers/messageHandler.js
const { prefix } = require('../utils/helpers');
const {handleStickerCommand} = require("./handlerStickerCommand")


async function messageHandler(sock, msg, store) {
  try {
    // ====== EXTRAER TEXTO DE FORMA SEGURA (nunca explota) ======
    let text = '';

    if (msg.message) {
      const m = msg.message;

      // Texto normal, caption de imagen/video/sticker, etc.
      text = m.conversation ||
             m.extendedTextMessage?.text ||
             m.imageMessage?.caption ||
             m.videoMessage?.caption ||
             m.stickerMessage?.caption ||   // ← importante para stickers con caption
             '';
    }

    const body = text.trim().toLowerCase();
    const from = msg.key.remoteJid;

    // Info básica del remitente
    const sender = msg.key.participant || from;
    const isGroup = from.endsWith('@g.us');
    const pushName = msg.pushName || 'Usuario';


    console.log(`[${isGroup ? 'Grupo' : 'Privado'}] ${pushName}: ${text}`);

    // ====== COMANDOS BÁSICOS ======
    if (body.includes('!hola') || body === '!hi') {
      await sock.sendMessage(from, { text: '¡Hola rey! 🤖 Todo funcionando perfecto 🔥' }, { quoted: msg });
      return;
    }

    if (body === '!ping') {
      await sock.sendMessage(from, { text: '🏓 Pong!' }, { quoted: msg });
      return;
    }

    if (body === '!menu') {
      await sock.sendMessage(from, { text: 'Comandos: hola, ping, menu, s (sticker)' }, { quoted: msg });
      return;
    }

    // ====== STICKER MÁGICO (funciona con imagen, video o sticker respondido) ======
    // if (body === '!s' || body === '!sticker' || body === '!stk') {
    //   let media = null;

    //   // Caso 1: imagen o video directo
    //   if (msg.message?.imageMessage) media = msg.message.imageMessage;
    //   else if (msg.message?.videoMessage) media = msg.message.videoMessage;

    //   // Caso 2: responde a imagen/video/sticker
    //   else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
    //     const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
    //     media = quoted.imageMessage || quoted.videoMessage || quoted.stickerMessage;
    //   }

    //   if (!media) {
    //     await sock.sendMessage(from, { text: '❌ Responde o envía imagen/video con "s"' }, { quoted: msg });
    //     return;
    //   }

    //   await sock.sendMessage(from, {
    //     sticker: { url: media.url },
    //     packname: "TuBotPro",
    //     author: "Crack",
    //     quality: 100
    //   }, { quoted: msg });

    //   return;
    // }


    if (text === '!sticker', text === '!s') {
    
          await handleStickerCommand(sock,msg,sender,text)
        
      }

  } catch (error) {
    console.error('Error en messageHandler:', error);
  }
}

module.exports = { messageHandler };