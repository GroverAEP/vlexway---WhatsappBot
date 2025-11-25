// src/config/owner.js
export const OWNERS = [
    '521234567890@c.us',  // Tu número principal
    '521998877665@c.us',  // Co-owner
];

export const ADMINS = [
    ...OWNERS,
    '521112233445@c.us',  // Admin de confianza
];

export const isOwner = (jid) => OWNERS.includes(jid);
export const isAdmin = (jid) => ADMINS.includes(jid);