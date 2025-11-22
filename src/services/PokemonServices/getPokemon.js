import axios from "axios";
import https from "https";

////////////////////////////////////////
/// Method: GetPokemon
/// Uso: Obtiene un pokemon por nombre
////////////////////////////////////////
export async function getPokemon(name) {
  try {
    // Obtengo la data de un pokemon 
    const rest = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`,{
    });
    
    console.log(rest);
    return rest.data;

  } catch (e) {
    console.error("❌ Error en getPokemon:", e);  }
}
