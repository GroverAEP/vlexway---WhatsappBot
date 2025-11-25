import { Handler } from "../core/Handler.js";

async function Shutdown({ msg, client }) {
    await client.send.reply(msg, "Apagando bot...");
    process.exit();
}

export const handlerShutdown = new Handler(
    "shutdown",
    "owner",
    Shutdown
);