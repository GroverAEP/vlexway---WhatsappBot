import fs from 'fs-extra';

export class DB_LOCAL {
    constructor(config) {
        this.dbPath = config.routes.PATH_DATABASE;
        this.files = {
            chats: `${this.dbPath}chats.json`,
            users: `${this.dbPath}users.json`,
            owners: `${this.dbPath}owners.json`
        };
    }

    // =================== MÉTODOS LOCALES ===================

    async load(fileName) {
        try {
            if (!fs.existsSync(this.files[fileName])) {
                await fs.writeJson(this.files[fileName], { [fileName]: [] }, { spaces: 2 });
            }
            const data = await fs.readJson(this.files[fileName]);
            return data[fileName] || [];
        } catch (err) {
            console.error(`Error cargando ${fileName}:`, err);
            return [];
        }
    }

    async save(fileName, data) {
        try {
            await fs.writeJson(this.files[fileName], { [fileName]: data }, { spaces: 2 });
        } catch (err) {
            console.error(`Error guardando ${fileName}:`, err);
        }
    }

    async add(fileName, item) {
        const data = await this.load(fileName);
        data.push(item);
        await this.save(fileName, data);
    }

    async remove(fileName, predicate) {
        let data = await this.load(fileName);
        data = data.filter(item => !predicate(item));
        await this.save(fileName, data);
    }

    // =================== MÉTODOS ONLINE (placeholder) ===================

    async fetchOnline(fileName) {
        // Aquí puedes hacer fetch a una API o base de datos en la nube
        console.log(`Fetching ${fileName} desde la nube...`);
        return []; // retornar datos online
    }

    async pushOnline(fileName, item) {
        // Aquí puedes subir item a tu API remota
        console.log(`Subiendo ${fileName} a la nube:`, item);
    }
}
