import fs from "fs-extra";

export class Owners {
    constructor(dbPath) {
        this.dbPath = `${dbPath}owners.json`;
    }

    async load() {
        if (!fs.existsSync(this.dbPath)) {
            await fs.writeJson(this.dbPath, { owners: [] }, { spaces: 2 });
        }
        const data = await fs.readJson(this.dbPath);
        this.owners = data.owners || [];
        return this.owners;
    }

    async save() {
        await fs.writeJson(this.dbPath, { owners: this.owners }, { spaces: 2 });
    }

    async add(owner) {
        await this.load();
        if (!this.owners.find(o => o.id === owner.id)) {
            this.owners.push(owner);
            await this.save();
        }
    }

    async remove(ownerId) {
        await this.load();
        this.owners = this.owners.filter(o => o.id !== ownerId);
        await this.save();
    }

    isOwner(ownerId) {
        // Función auxiliar para normalizar IDs, sacando los dígitos antes de ":"
        const normalizeId = (id) => {
            if (!id || typeof id !== 'string') return '';
            return id.replace(/\D/g, '') || id.split('@')[0].split(':')[0] || '';
        };

        const idNomalized = normalizeId(ownerId);
        console.log(idNomalized)
        return this.owners.some(o => normalizeId(o.id) === idNomalized);
    }

    
    get(ownerId) {
        return this.owners.find(o => o.id === ownerId);
    }

    all() {
        return this.owners;
    }
}
