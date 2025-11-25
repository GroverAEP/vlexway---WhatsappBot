//Global Handler Manage Pymes

export async function flowManagerPymes (params) {
    
    const handlers = [

    ];
    
    try{
        const DisparadoresMenu = [`${PREFIX}menu`, `${PREFIX}m`];
        const normalize = (str) => str.trim().toLowerCase() 
        const isTrigger = (text, triggers) => {
            const normalizeText = normalize(text);
            return triggers.map(normalize).includes(normalizeText)
        }
        // triggers.some(t => t.toLowerCase() === text.toLowerCase().trim());
        
        if (!isTrigger(text, DisparadoresMenu)) {
        return;
        }
        


     } catch(e){
        console.log(e);
     }
}
