// src/config/index.js

import isOwner from '../core/middleware/isOwner.js';
import { defaults } from './bot.js';
import { limits } from './limits.js';
import { OWNERS } from './owners.js';
import { routes } from './routes.js';

// export * from './env.js';
export * from './bot.js';
export * from './owners.js';
export * from './limits.js';
export * from './routes.js';
// Exportar todo junto para usar fácil
export const config = {
    // ENV,
    defaults,
    limits,
    routes
};