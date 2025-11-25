// src/utils/send.js
import { delay } from '@whiskeysockets/baileys';

export class Sender {
    constructor(sock, config = {}) {
        this.sock = sock;
        this.config = {
            footer: config.footer || '© Bot Pro 2025',
            owner: config.owner || '521234567890@c.us',
            delay: config.delay || 800, // ms entre mensajes (anti-ban)
            devMode: config.devMode || false
        };
        this.sentCount = 0;
    }

    // ============ ENVÍOS BÁSICOS ============
    async text(jid, text, options = {}) {
        if (this.config.devMode) return console.log('[DEV] →', text);
        await this.sock.sendMessage(jid, { text: `${text}\n\n_${this.config.footer}_` }, options);
        this.sentCount++;
        await delay(this.config.delay);
    }

    async reply(msg, text) {
        await this.text(msg.key.remoteJid, text, { quoted: msg });
    }

    async image(jid, image, caption = '', options = {}) {
        await this.sock.sendMessage(jid, { 
            image: typeof image === 'string' ? { url: image } : image,
            caption: caption ? `${caption}\n\n_${this.config.footer}_` : this.config.footer
        }, options);
        await delay(this.config.delay);
    }

    async video(jid, video, caption = '', gif = false) {
        await this.sock.sendMessage(jid, { 
            video, caption: caption ? `${caption}\n\n_${this.config.footer}_` : this.config.footer,
            gifPlayback: gif
        });
        await delay(this.config.delay);
    }

    async sticker(jid, buffer, options = {}) {
        await this.sock.sendMessage(jid, { sticker: buffer }, options);
        await delay(this.config.delay);
    }

    async react(msg, emoji) {
        await this.sock.sendMessage(msg.key.remoteJid, {
            react: { text: emoji, key: msg.key }
        });
    }

    // ============ AVANZADOS ============
    async buttons(jid, text, buttons, quoted = null) {
        const btns = buttons.map((b, i) => ({
            buttonId: String(i+1),
            buttonText: { displayText: b },
            type: 1
        }));
        await this.sock.sendMessage(jid, {
            text: `${text}\n\n_${this.config.footer}_`,
            footer: 'Elige una opción',
            buttons: btns,
            headerType: 1
        }, { quoted });
    }

    async list(jid, title, buttonText, sections) {
        await this.sock.sendMessage(jid, {
            title,
            text: title,
            buttonText,
            sections,
            footer: this.config.footer
        }, { messageType: 'listMessage' });
    }

    async document(jid, buffer, filename, mimetype = 'application/pdf') {
        await this.sock.sendMessage(jid, {
            document: buffer,
            mimetype,
            fileName: filename
        });
    }
}