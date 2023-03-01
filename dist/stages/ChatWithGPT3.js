"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithGPT3 = void 0;
const open_ia_service_1 = require("../services/open_ia.service");
const storage_1 = require("../storage");
class ChatWithGPT3 {
    async execute({ to, client, message }) {
        if (message.body === '#sair') {
            client.sendText(to, `Foi um prazer atende-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma  dúvida pode sempre me procurar! Obrigado.`);
            storage_1.storage[to].stage = 0;
            return;
        }
        client.startTyping(to);
        const response = await new open_ia_service_1.OpenIaService().createCompletion(message.body);
        await client.sendText(to, response);
        await client.stopTyping(to);
        setTimeout(() => {
            storage_1.storage[to].stage = 0;
        }, 300000);
    }
}
exports.chatWithGPT3 = new ChatWithGPT3();
