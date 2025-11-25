// src/database/index.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const adapter = new JSONFile('./src/database/db.json');
const db = new Low(adapter);

await db.read();
db.data ||= { users: {}, products: [], orders: [] };
await db.write();

export class Database {
    async getUser(jid) { return db.data.users[jid] || null; }
    async createUser(jid, data) { /* ... */ }
    async save() { await db.write(); }
}

export default new Database();