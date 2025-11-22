// import { }


export async  function handleAdminCommand({sock,msg,sender,text}){
    if (text.startsWith('!CloseChat') || text.startsWith('!CChat')) {

        await sock.sendMessage(sender, {
            text: "Para usar este comando tienes que ser admin"

        })
    }
    










    // if (text.startsWith('!showErased') || text.startsWith('!sE')) {
    //     const id = (msg.key.remoteJid)

    //     console.log(msg.messageContextInfo)

       


    //     await sock.sendMessage(sender, {
    //         text: "Para usar este comando tienes que ser admin"
    //     })

    // }




    // const jid = msg.key.remoteJid
    // const me = sock.user.id

    // const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

    // if (mentions.includes(me)) {
    //     await sock.sendMessage(jid, {
    //         text: `👋 Hola! Has mencionado al bot.\n\n¿Qué necesitas?`
    //     })
    // }


    // if (text )



}