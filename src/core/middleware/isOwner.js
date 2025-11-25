export default async function isOwner(msg, client) {
    if (msg.from !== client.OWNER_NUMBER) {
        await client.sock.sendMessage(msg.from, { text: 'Solo para el dueño 🤫' });
        return false;
    }
    return true;
}