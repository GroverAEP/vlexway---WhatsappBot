import fs from "fs-extra";

export class Users {
    constructor(dbPath) {
        this.dbPath = `${dbPath}users.json`;
    }

    async load() {
        if (!fs.existsSync(this.dbPath)) {
            await fs.writeJson(this.dbPath, { users: [] }, { spaces: 2 });
        }
        const data = await fs.readJson(this.dbPath);
        this.users = data.users || [];
        return this.users;
    }

    async save() {
        await fs.writeJson(this.dbPath, { users: this.users }, { spaces: 2 });
    }

    async add(user) {
        await this.load();
        // Evitar duplicados por id
        if (!this.users.find(u => u.id === user.id)) {
            this.users.push(user);
            await this.save();
        }
    }

    async remove(userId) {
        await this.load();
        this.users = this.users.filter(u => u.id !== userId);
        await this.save();
    }

    async update(userId, key, value) {
        await this.load();
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user[key] = value; // Actualiza la propiedad indicada
            await this.save();
            return true; // Éxito
        }
        return false; // Usuario no encontrado
    }

   // --- Nuevo método equals ---
   async equals(userId, field, value) {
        await this.load();

        const user = this.users.find(u => u.id === userId);
        if (!user) return false;
        return user[field] === value;
    }


    isUser(userId) {
        return this.users.some(u => u.id === userId);
    }
    
    get(userId) {
        return this.users.find(u => u.id === userId);
    }


    all() {
        return this.users;
    }
}
