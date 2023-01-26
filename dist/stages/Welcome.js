"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = void 0;
const storage_1 = require("../storage");
class Welcome {
    execute({ to, client, message }) {
        client.sendText(to, `Olá ${message.sender.pushname}, \n\nEu sou o Cib 🤖, seu assistente virtual do T.I SL.\nEm que posso ajudar?\n\n1 - Abrir um novo chamado \n2 - Falar com um de nossos atendentes`);
        storage_1.storage[to].stage = 1;
    }
}
exports.welcome = new Welcome();
