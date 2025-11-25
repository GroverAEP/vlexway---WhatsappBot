// admin/handlerBan.js
export const handlerBan = {
    name: "ban",
    role: "owner",
    run: bannedUsers,
};

export async function bannedUsers({msg,text,client,sock}) {
    try{
        const PREFIX = client.config.defaults.prefix;
        const triggers = [`${PREFIX}b`, `${PREFIX}ban`];

        const normalize = str => str.trim().toLowerCase();

        // Verifica si el texto empieza con alguno de los triggers
        const withStart = triggers.some(t => normalize(text).startsWith(normalize(t)));
        if (!withStart) return;
            

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const bannedUsersList = [];

        if (mentioned.length === 0) {
            return await client.send.reply(msg, 'No se mencionó ningún usuario para banear.');
        }
      
        for (const mention of mentioned) {
        // Normalizar ID por si tiene ":22" o similares
            const normalizedId = mention.split(':')[0];
            bannedUsersList.push(normalizedId);

        // Actualizar estado en la base de datos local
        await client.manager.users.update(normalizedId, "status", "banned");
        }
       
        
        await client.send.reply(
            msg,
            `Estos usuarios han sido baneados del bot: \n${bannedUsersList.join('\n')}`)
       


    //    if (!confirmBanned)return;

    } catch (err) {
        console.error('Error en bannedUsers:', err);
    }
}




// // Lista de usuarios baneados
// const bannedUsers = new Set();

// Método para banear un usuario
export function banUser(userId) {
    bannedUsers.add(userId);
    return true;
}

// Método para desbanear
export function unbanUser(userId) {
    bannedUsers.delete(userId);
    return true;
}