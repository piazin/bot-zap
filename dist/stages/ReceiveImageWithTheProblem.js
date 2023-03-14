"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveImageWithTheProblem = void 0;
const storage_service_1 = require("../services/storage.service");
const invalidOption_1 = require("./invalidOption");
class ReceiveImageWithTheProblem {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message }) {
        try {
            client.sendText(to, 'Você gostaria de enviar alguma imagem do problema? Se sim, por favor, envie apenas uma imagem. Caso contrário, digite "não".');
            this.storageService.setProblemOrRequestMessage(message.body);
            var stage = this.storageService.getTicket() ? 5 : 3;
            this.storageService.setStage(stage);
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            await invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.ReceiveImageWithTheProblem = ReceiveImageWithTheProblem;
