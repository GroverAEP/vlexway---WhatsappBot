// 2. classes/User.js → CLASE CON MÉTODOS (la que usas en el bot)
export class User {
    constructor(data) {
        Object.assign(this, data); // copia todos los datos del model
    }

    // MÉTODOS MÁGICOS (esto es lo que TÚ quieres)
    isPremium() { return this.premium; }
    isBanned() { return this.banned; }

    canUseAI() {
        if (this.isPremium()) return true;
        return this.dailyAi < 10;
    }

    canCreateSticker() {
        return this.dailyStickers < 50 || this.isPremium();
    }

    incrementAI() { this.dailyAi++; }
    incrementSticker() { this.dailyStickers++; }

    hasCompletedRegistration() {
        return this.name && this.age;
    }
}