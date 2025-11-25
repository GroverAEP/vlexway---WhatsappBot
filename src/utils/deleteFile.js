import fs from "fs-extra";

export async function deleteFile(filePath) {
    try {
        if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
            console.log(`Archivo eliminado: ${filePath}`);
        } else {
            console.log(`Archivo no encontrado: ${filePath}`);
        }
    } catch (err) {
        console.error("Error eliminando archivo:", err);
    }
}