import { normalizeId } from '../../utils/normalize.js';
import { handlerPokemonApi, PokemonApi } from '../flows/utils/handlerPokemonApi.js';
import { handlerStickerCommand } from '../flows/utils/handlerStickerCommand.js'
import { handlerTestCommand } from '../flows/utils/handlerTestCommand.js';
import { handlerBan } from '../flows/owner/handlerBan.js';
// import { handleQrCommand } from './handlerQr.js'
// import { handlerPokemonApi } from './handlerPokemonApi.js'
// import { handleRandomCommand } from './handlerRandomComand.js'
// import { handleAdminCommand } from './handlerAdminCommand.js'
// import { handlerGameCommand } from './handlerGameCommand.js'
// import { handlerTestCommand } from './handlerTestCommand.js'

const handlers = [
    handlerStickerCommand,
    handlerBan,
    handlerTestCommand,
    handlerPokemonApi,
    // handleUserCommand,
    // handleGroupCommand
];

export const dispatchHandlers = async (msg,text,client,sock) => {
    const owners = await client.manager.owners.load()
    const admins = await client.manager.admins.load()
    const users = await client.manager.users.load()

    const sender = msg.key.participant || msg.key.remoteJid;
    const normalizado = await normalizeId(sender)
    console.log(normalizado)
    console.log(sender)
    const userIsOwner = client.manager.owners.isOwner(normalizado);
    const userIsAdmin = client.manager.admins.isAdmin(normalizado);


    // const groupAdmins = msg.groupMetadata?.participants
    //     ?.filter(p => p.admin)
    //     .map(p => p.id) || [];
    
    //     client.middleware.isOwner


    for (const handler of handlers) {
        try {
                  // 1. Validar permisos
            if (handler.role === "owner" && !userIsOwner) continue;
            if (handler.role === "admin" && !userIsAdmin && !userIsOwner) continue;

            await handler.run({msg,text,client,sock});
        } catch (err) {
            console.error("Error en handler:", handler.name, err);
        }
    }
};
