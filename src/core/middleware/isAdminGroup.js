export async function isAdminGroup({ msg, client }) {
    const chatId = msg.key.remoteJid;
    const userId = msg.key.participant;

    const metadata = await client.sock.groupMetadata(chatId);
    const admins = metadata.participants.filter(p => p.admin);

    return admins.some(a => a.id === userId);
}