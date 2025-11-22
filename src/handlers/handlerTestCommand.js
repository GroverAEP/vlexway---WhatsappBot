import { downloadYoutubeVideo } from "../services/youtubeServices/getVideo.js";
import { IMAGE, VIDEO } from "../utils/config.js";


export async function handlerTestCommand({sock,msg,sender,text}) {
    try {
        
            //////////////////////////////
            //  Primer comando: "Hola"
            //////////////////////////////
            if (text === '!hola') {
                console.log(sender)
                await sock.sendMessage(sender, { 
                
                // mentions: [msg.key.remoteJid],
                image: {url: `${IMAGE}PokemonTCG.webp`,},
                caption: `👋 ¡Hola! ${msg.pushName} Soy un bot TCG Pokemon 🐱‍💻`,
                sendEphemeral: true,
                quoted: msg })
            }

            ///////////////////////////////////////////////////
            // Segundo Comando : explocion
            // el mensaje enviado se elimina en 10 segundos
            ///////////////////////////////////////////////////
            if (text === '!e' ||text === '!explote'){ 

                const  msgExplote = await sock.sendMessage(sender,{text: 'Este mensaje va a explotar en 10 segundos!'})

                setTimeout(async ()=> {
                console.log(msgExplote.key)
                await sock.sendMessage(sender,{delete: msgExplote.key})
                }, 10000)
            }


            if (text.startsWith('!say') && text.match(/^!say\s+(.+)/)) {
                const sayedMsg = text.match(/^!say\s+(.+)/)
                await sock.sendMessage(sender, {
                text:`${msg.pushName}: ${sayedMsg[1]}`
                })


            } else if (text.startsWith('!say')) {
                await sock.sendMessage(sender,{
                    text: `el comando necesita que definas el texto: !say {texto}`,
                    quoted: msg
                })
            }

            if (text === "!v") {


            await sock.sendMessage(sender,{
                video: {url:`${VIDEO}PokeApi.mp4`},
                caption: "Un video para aprender PokeApi node.js"
            })

            }
            if (text === "!yt") {
                await sock.sendMessage(sender,{
                text:"comando no disponible"
                })
            }

            if (text.startsWith("!yt ")) {
                const url = text.split(" ")[1];

                await sock.sendMessage(sender, { text: "📥 Descargando video, espera..." });

                try {
                    const filePath = await downloadYoutubeVideo(url);
                    console.log(filePath)
                    await sock.sendMessage(sender, {
                        video: { url: filePath },
                        mimetype: "video/mp4",
                        caption: "Aquí está tu video 🎬"
                    });
                } catch (err) {
                    await sock.sendMessage(sender, { text: "❌ Error al descargar el video." });
                    console.error(err);
                }
            }






            /////////////////////////////////////////////////////
            // Especial Comando NSFW : Rule34
            // Pagina web para obtener imagenes NSFW
            //////////////////////////////////////////////////
            if (text === "!r34"){
                // console.log(text)
                // await handleRule34(sock,msg,sender,text)
            }
                // await utilsCommand(sock,msg,sender,text)
            // await handletoImage(sock,msg,sender,text)
            // await handletoVideo(sock,msg,sender,text)

            console.log("Mensaje recibido:", msg)


    } catch (error) {
        
    }

}