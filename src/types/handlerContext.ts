import { WASocket,proto  } from "@whiskeysockets/baileys";

interface HandlerContext{
    sock: WASocket,
    msg: proto.IWebMessageInfo,
    sender: string,
    text: string,
}

