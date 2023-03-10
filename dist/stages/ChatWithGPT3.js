"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithGPT3 = void 0;
const open_ia_service_1 = require("../services/open_ia.service");
const storage_1 = require("../storage");
const invalidOption_1 = require("./invalidOption");
class ChatWithGPT3 {
    async execute({ to, client, message }) {
        try {
            if (message.body === '#sair') {
                client.sendText(to, `Foi um prazer atende-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma  dúvida pode sempre me procurar! Obrigado.`);
                storage_1.storage[to].stage = 0;
                return;
            }
            client.startTyping(to);
            const response = await new open_ia_service_1.OpenIaService().createCompletion(message.body);
            await client.sendText(to, response);
            await client.stopTyping(to);
            var timeState = setTimeout(() => {
                storage_1.storage[to].stage = 0;
            }, 600000);
            timeState.refresh();
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.chatWithGPT3 = new ChatWithGPT3();
