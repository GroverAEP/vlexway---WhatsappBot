// src/config/index.js

import { isAdminGroup } from "./isAdminGroup.js";
import { isBanned } from "./isBanned.js";
import { isGroup } from "./isGroup.js";
import isOwner from "./isOwner.js";



// Exportar todo junto para usar fácil
export const middleware = {
    // ENV,
    isBanned,
    isGroup,
    isOwner,
    isAdminGroup,

};