import fs from "fs-extra";

export class Admins {
    constructor(dbPath) {
        this.dbPath = `${dbPath}admins.json`;
    }

    async load() {
        if (!fs.existsSync(this.dbPath)) {
            await fs.writeJson(this.dbPath, { admins: [] }, { spaces: 2 });
        }
        const data = await fs.readJson(this.dbPath);
        this.admins = new Set(data.admins || []);
        return this.admins;
    }

    async save() {
        await fs.writeJson(this.dbPath, { admins: [...this.admins] }, { spaces: 2 });
    }

    async add(jid) {
        if (!this.admins) await this.load();
        this.admins.add(jid);
        await this.save();
    }

    async remove(jid) {
        if (!this.admins) await this.load();
        this.admins.delete(jid);
        await this.save();
    }

    isAdmin(jid) {
        return this.admins?.has(jid);
    }

    all() {
        return [...this.admins];
    }
}
