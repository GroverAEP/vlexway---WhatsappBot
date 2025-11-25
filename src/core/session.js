// src/core/session.js

export class SessionManager {
  constructor() {
    // contenedor de sesiones por usuario
    this.sessions = new Map();

    // tiempo antes de limpiar sesión (30 min)
    this.TTL = 30 * 60 * 1000;
  }

  // Obtiene la sesión del usuario o la crea si no existe
  get(userId) {
    let session = this.sessions.get(userId);

    if (!session) {
      session = this._createSession();
      this.sessions.set(userId, session);
    }

    // actualizar última interacción
    session.lastInteraction = Date.now();

    return session;
  }

  // Crea un nuevo objeto de sesión vacío
  _createSession() {
    return {
      step: null,       // paso actual del flujo
      flow: null,       // nombre del flujo (registro, compra, etc)
      data: {},         // datos temporales
      lastInteraction: Date.now()
    };
  }

  // Elimina sesiones viejas
  cleanup() {
    const now = Date.now();
    for (const [userId, session] of this.sessions) {
      if (now - session.lastInteraction > this.TTL) {
        this.sessions.delete(userId);
      }
    }
  }
}