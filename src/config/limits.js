// src/config/limits.js
export const limits = {
    free: {
        aiMessages: 10,
        stickersPerDay: 50,
        downloadsPerDay: 5,
    },
    premium: {
        aiMessages: Infinity,
        stickersPerDay: 500,
        downloadsPerDay: 100,
    },
    cooldown: {
        command: 1000,    // 1 segundo entre comandos
        ai: 3000,         // 3 segundos entre IA
    }
};