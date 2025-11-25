import { getPokemon } from "../../../services/PokemonServices/getPokemon.js";


export const handlerPokemonApi= {
    name: "pokemonApi",
    role: "all",
    run: PokemonApi,
};
export async function PokemonApi({msg,text,client,sock}){
 try{
     if (text.startsWith("!pokemon") || text.startsWith("!p")) {
        const args = text.split(" ");
        const pokemonName = args[1]; // nombre del Pokémon
        const sender = msg.key.participant || msg.key.remoteJid;
    
        if (!pokemonName) {
            return sock.sendMessage(sender, {
                text: "Debes escribir un Pokémon.\nEjemplo: `!pokemon pikachu`"
            });
        }
    
        // Si mandó el nombre, responder
        await sock.sendMessage(sender, {
            text: `Buscando información de *${pokemonName}*...`
        });
        
        const resPokemon = await getPokemon(pokemonName)
    
        if (!resPokemon) {
            await sock.sendMessage(sender, { text: "❌ Pokémon no encontrado o error en la API." });
            return;
        }

        
        // Validación segura
        const imageUrl = resPokemon?.sprites?.other?.['official-artwork']?.front_default;

        if (!imageUrl) {
            return sock.sendMessage(sender, { text: "❌ No encontré imagen del Pokémon." });
        }
        console.log(resPokemon.sprites.other['official-artwork']['front_default'])
        console.log(resPokemon.name.toUpperCase())
        console.log(resPokemon.height)
    
    
        await sock.sendMessage(sender, {
                    image: { url: imageUrl },
                    caption: `✨ *${resPokemon.name.toUpperCase()}*\nAltura: ${resPokemon.height}\nPeso: ${resPokemon.weight}`
                });
    }
 } catch(e){
    console.log(e);
 }
}
