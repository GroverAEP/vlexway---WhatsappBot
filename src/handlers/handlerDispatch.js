import { handleStickerCommand } from './handlerStickerCommand.js'
import { handleQrCommand } from './handlerQr.js'
import { handlerPokemonApi } from './handlerPokemonApi.js'
import { handleRandomCommand } from './handlerRandomComand.js'
import { handleAdminCommand } from './handlerAdminCommand.js'
import { handlerGameCommand } from './handlerGameCommand.js'
import { handlerTestCommand } from './handlerTestCommand.js'

const handlers = [
    handlerPokemonApi,
    handleAdminCommand,
    handleRandomCommand,
    handlerTestCommand,
    handlerGameCommand,
    handleStickerCommand,
    handleQrCommand
];

export const dispatchHandlers = async (sock, msg, sender, text) => {
    for (const handler of handlers) {
        try {
            await handler({ sock, msg, sender, text }); // pasamos un único objeto
        } catch (err) {
            console.error("Error en handler:", handler.name, err);
        }
    }
};
