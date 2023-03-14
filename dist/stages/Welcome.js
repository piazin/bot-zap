"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Welcome = void 0;
const invalidOption_1 = require("./invalidOption");
const firstOptions_1 = require("../constants/firstOptions");
const storage_service_1 = require("../services/storage.service");
class Welcome {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message, }) {
        this.storageService = new storage_service_1.StorageService(to);
        try {
            await client.sendText(to, `Olá ${message.sender.pushname}, \nEu sou o Cib, o assistente virtual do T.I SL.\nEstou aqui para ajudá-lo`);
            await client.sendListMenu(to, 'Por favor, escolha uma das opções abaixo para que eu possa auxiliá-lo da melhor maneira possível', '', 'selecionar', firstOptions_1.firstOptions);
            this.storageService.setStage(1);
        }
        catch (error) {
            console.error('🚀 ~ file: Welcome.ts:28 ~ Welcome ~ error:', error);
            await invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.Welcome = Welcome;
