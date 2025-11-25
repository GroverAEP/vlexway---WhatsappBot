// src/classes/Sender.js
import { delay } from '@whiskeysockets/baileys';

export class Sender {
    constructor(sock, options = {}) {
        this.sock = sock;
        this.footer = options.footer || '';
        this.delayMs = options.delayMs || 800; // anti-ban
    }
   // Util: normaliza path o Buffer -> Buffer
    async _toBuffer(input) {
        if (!input) throw new Error("Archivo no provisto");
        // Si es Buffer, devolverlo
        if (Buffer.isBuffer(input)) return input;
        // Si es string y parece path, leer archivo
        if (typeof input === "string") {
        const resolved = path.resolve(input);
        if (!fs.existsSync(resolved)) throw new Error(`Archivo no existe: ${resolved}`);
        return fs.readFileSync(resolved);
        }
        // Si es stream, leer a buffer (opcional)
        if (input.readable === true && typeof input.on === "function") {
        return await new Promise((resolve, reject) => {
            const chunks = [];
            input.on("data", c => chunks.push(c));
            input.on("end", () => resolve(Buffer.concat(chunks)));
            input.on("error", reject);
        });
        }
        throw new Error("Formato de archivo no soportado");
    }



    async text(jid, text, quoted = null) {
        return await this.sock.sendMessage(jid, { 
            text: `${text}\n\n_${this.footer}_` 
        }, { quoted });
    }

    async reply(msg, text) {
        return await this.text(msg.key.remoteJid, text, msg);
    }
 
    async audio(msg, bufferOrUrl, options = {}) {
        const jid = msg.key.remoteJid;
        const {
                ptt = false,     // valor por defecto
                quoted = null,   // valor por defecto
                waveform = null,
                seconds = 0
            } = options;

        return await this.sock.sendMessage(jid, {
            audio: typeof bufferOrUrl === 'string' ? { url: bufferOrUrl } : bufferOrUrl,
            mimetype: 'audio/mp4', // o 'audio/mpeg' según el tipo de archivo
            ptt: ptt // si quieres que se envíe como nota de voz
        }, { quoted });
    }

    async image(msg, bufferOrUrl, caption = '', options = {}) {
        const jid = msg.key.remoteJid;

        return await this.sock.sendMessage(jid, {
            image: typeof bufferOrUrl === 'string' ? { url: bufferOrUrl } : bufferOrUrl,
            caption: caption ? `${caption}\n\n_${this.footer}_` : this.footer
        }, { quoted });
    }

    async video(msg, buffer, options = {}) {
        const jid = msg.key.remoteJid;
        const {
                ptt = false,     // valor por defecto
                quoted = null,   // valor por defecto
                waveform = null,
                seconds = 0,
                gif = false,
                caption = "",
            } = options;

        return await this.sock.sendMessage(jid, {
            video: buffer,
            caption: caption ? `${caption}\n\n_${this.footer}_` : this.footer,
            gifPlayback: gif
        });
    }

    async sticker(jid, buffer, quoted = null) {
        return await this.sock.sendMessage(jid, { sticker: buffer }, { quoted });
    }

    async react(msg, emoji) {
        return await this.sock.sendMessage(msg.key.remoteJid, {
            react: { text: emoji, key: msg.key }
        });
    }

    async buttons(jid, text, buttons, quoted = null) {
        const btns = buttons.map((txt, i) => ({
            buttonId: String(i + 1),
            buttonText: { displayText: txt },
            type: 1
        }));

        return await this.sock.sendMessage(jid, {
            text: `${text}\n\n_${this.footer}_`,
            buttons: btns,
            headerType: 1
        }, { quoted });
    }

    
    // Delay anti-ban
    async wait() {
        await delay(this.delayMs);
    }
}