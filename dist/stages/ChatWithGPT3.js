"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWithGPT3 = void 0;
const openIa_service_1 = require("../services/openIa.service");
const storage_service_1 = require("../services/storage.service");
const invalidOption_1 = require("./invalidOption");
class ChatWithGPT3 {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message }) {
        try {
            if (message.body === '#sair') {
                const farewellMessage = `Foi um prazer atendê-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma dúvida pode sempre me procurar! Obrigado.`;
                await client.sendText(to, farewellMessage);
                this.storageService.setStage(0);
                return;
            }
            client.startTyping(to);
            const response = await new openIa_service_1.OpenIaService().createCompletion(message.body);
            await client.sendText(to, response);
            await client.stopTyping(to);
            const idleTimeout = setTimeout(() => {
                this.storageService.setStage(0);
            }, ChatWithGPT3.MAX_IDLE_TIME_MS);
            idleTimeout.refresh();
        }
        catch (error) {
            console.error(`Error in ChatWithGPT3.execute: ${error}`);
            await invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.ChatWithGPT3 = ChatWithGPT3;
ChatWithGPT3.MAX_IDLE_TIME_MS = 600000;
