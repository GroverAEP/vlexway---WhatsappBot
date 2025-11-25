// handlers/message/commandHandler.js
export async function handleCommands(msg, text, client) {
    if (!text.startsWith(client.config.prefix)) return;

    const args = text.slice(client.config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'ping':
            await client.send.reply(msg, 'Pong!');
            break;
        case 'sticker':
            // lógica para crear sticker
            break;
        // más comandos...
    }
}
