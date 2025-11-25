// src/handlers/core/Handler.js
export class Handler {
    constructor(name, role, run) {
        this.name = name;   // "sticker"
        this.role = role;   // "all" | "admin" | "owner"
        this.run = run;     // función async ({msg,text,client})
    }
}