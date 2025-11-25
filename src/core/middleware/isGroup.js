export function isGroup({ msg }) {
    const chatId = msg.key.remoteJid;
    return chatId.endsWith("@g.us");
}
