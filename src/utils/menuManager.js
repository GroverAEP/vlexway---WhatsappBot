
import { flowMenuPrincipal } from '../flows/flowMenuPrincipal.js'
import { dispatchHandlers } from '../handlers/handlerDispatch.js'
import { menuOffChat } from './menuOffChat.js';


export async function menuManager(sock,msg,allowedChats) {
    try{
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text
            const chatId = msg.key.remoteJid
            // const chatId = msg
            // Guardamos el mensaje con su ID
            // ====
            if (!text || typeof text !== "string") return; // Evita errores con mensajes vacíos o sin texto


            // ============== Accesos chats validados ==================== //

            await menuOffChat(sock,chatId,msg,allowedChats) 

            // =============== Menu Principal ==================== //

            

            await flowMenuPrincipal(sock,chatId,text)
            
            // =============== HANDLERS PRINCIPALES ===============
            await dispatchHandlers(sock, msg, chatId, text);
          
            // await handlerPokemonApi(sock,msg,sender,text)
            // await handleAdminCommand(sock,msg,sender,text)
            // await handleRandomCommand(sock,msg,sender,text)
            // await handlerTestCommand(sock,msg,sender,text)
            // await handlerGameCommand(sock,msg,sender,text)
            // await handleStickerCommand(sock,msg,sender,text)
            // await handleQrCommand(sock,msg,sender,text)
        
            // await handletoImage(sock,msg,sender,text)
            // await handletoVideo(sock,msg,sender,text)
            
    }catch (err){
        console.error("Error en menuManager:", err);
    }

}