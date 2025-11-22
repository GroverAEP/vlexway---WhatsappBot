// src/utils/chatManager.js
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHATS_CACHE_FILE = path.join(__dirname, "../data/activeChats.json");

// Crear carpeta data si no existe
await fs.ensureDir(path.dirname(CHATS_CACHE_FILE));

// Cache en memoria + archivo persistente
let activeChats = new Map(); // jid → { name, isGroup, participants? }

export const updateChatCache = async (sock) => {
  try {
    const chats = await sock.groupFetchAllParticipating?.() || {};
    const privateChats = (await sock.fetchPrivacySettings?.()) ? await sock.contactList?.() || [] : [];

    const allChats = new Map();

    // Grupos
    for (const [jid, group] of Object.entries(chats)) {
      allChats.set(jid, {
        jid,
        name: group.subject || "Grupo sin nombre",
        isGroup: true,
        participants: group.participants?.length || 0,
      });
    }

    // Chats privados (aproximado con mensajes recientes o contactos)
    const recent = await sock.fetchMessageHistory?.() || [];
    for (const msg of recent) {
      if (msg.key.remoteJid?.endsWith("@s.whatsapp.net") && !allChats.has(msg.key.remoteJid)) {
        const contact = await sock.getContactById?.(msg.key.remoteJid) || {};
        allChats.set(msg.key.remoteJid, {
          jid: msg.key.remoteJid,
          name: contact.notify || contact.verifiedName || msg.key.remoteJid.split("@")[0],
          isGroup: false,
        });
      }
    }

    activeChats = allChats;

    // Guardar en disco para persistencia
    await fs.writeJson(CHATS_CACHE_FILE, Object.fromEntries(allChats), { spaces: 2 });
    console.log(`📋 Cache de chats actualizado: ${allChats.size} chats`);
  } catch (err) {
    console.error("Error actualizando cache de chats:", err);
  }
};

export const getAllChats = () => {
  return Array.from(activeChats.values());
};

export const getChatByJid = (jid) => activeChats.get(jid);

// Cargar cache al iniciar
export const loadChatCache = async () => {
  if (await fs.pathExists(CHATS_CACHE_FILE)) {
    const data = await fs.readJson(CHATS_CACHE_FILE);
    activeChats = new Map(Object.entries(data));
    console.log(`✅ Cache de chats cargado: ${activeChats.size} chats`);
  }
};