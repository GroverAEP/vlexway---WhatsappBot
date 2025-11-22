export async function flowMenuPrincipal(sock, sender, text) {
    try {
        const NAME = "";
        const PREFIX = "!";
        const DisparadoresMenu = [`${PREFIX}menu`, `${PREFIX}m`];

        // Verificar si el texto coincide EXACTAMENTE
        if (!DisparadoresMenu.includes(text.toLowerCase())) {
            return; // no mostrar nada si no pidió menú
        }

        await sock.sendMessage(sender, {
            text: `👋 *¡Hola! Bienvenido a Mi Bot ${NAME}*  
                
            Funcionalidades básicas:
            ${PREFIX}say {nombre} -> Para decir algo  
            ${PREFIX}p Pokemon {nombre} -> Permite escoger un Pokémon  
            ${PREFIX}s -> Crear stickers de imagen o video  
            `,
        });

    } catch (error) {
        await sock.sendMessage(sender, {
            text: `Error al ejecutar este comando ${error}`
        });
    }
};
