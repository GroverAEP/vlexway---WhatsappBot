// import { }


export async  function handleRandomCommand({sock,msg,sender,text}){
    
    
    if (text.startsWith("!ramdon") || text.startsWith("!rnd")) {
        
        const numero = Math.floor(Math.random() * 100) + 1;

        //  const content = text.split(" ").slice(1).join(" ")

        // if (!content) {
            
        //     return await sock.sendMessage(sender, {
        //         text:"⚠️ Debes usar: *!GenerateQr <texto>*"
        //     })
        // }
        console.log(numero);



        await sock.sendMessage(sender,
            {
                text: `📌 *Numero Generado Aleatorio*\n Usuario: ${msg.pushName} \n Numero Aleatorio: ${numero}`
            }
         )
    }   else{
        console.log("error")
    }

}