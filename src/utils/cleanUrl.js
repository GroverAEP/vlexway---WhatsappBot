// Función para limpiar URL
export function cleanYoutubeUrl(url) {
    try {
        const u = new URL(url);

        // Eliminar parámetros que causan problemas
        u.searchParams.delete("list");
        u.searchParams.delete("start_radio");

        return u.toString();
    } catch {
        return url;
    }
}