"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkOrNewCall = void 0;
const invalidOption_1 = require("./invalidOption");
const storage_service_1 = require("../services/storage.service");
class TalkOrNewCall {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message }) {
        this.storageService = new storage_service_1.StorageService(to);
        try {
            if (!message.listResponse)
                return invalidOption_1.invalidOption.execute({ to, client });
            const options = {
                '1': {
                    text: 'Para abrir um novo chamado, por favor, descreva o problema, dúvida ou requisição que você deseja fazer.',
                    isTicket: true,
                    nextStage: 2,
                },
                '2': {
                    text: 'Faça uma breve descrição do problema que está enfretando...',
                    isTicket: false,
                    nextStage: 2,
                },
                '3': {
                    text: 'Qual sua pergunta?',
                    isTicket: false,
                    nextStage: 7,
                    toLeave: true,
                },
                '4': {
                    text: 'Descreva com detalhes a imagem que deseja.',
                    isTicket: false,
                    nextStage: 8,
                    toLeave: true,
                },
            };
            const selectedOption = message.listResponse?.singleSelectReply?.selectedRowId;
            const option = options[selectedOption];
            if (!option) {
                return invalidOption_1.invalidOption.execute({ to, client });
            }
            if (option.toLeave)
                await client.sendText(to, 'Para encerrar o chat digite #sair');
            await client.sendText(to, option.text);
            this.storageService.setStage(option.nextStage);
            this.storageService.setTicket(option.isTicket);
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.TalkOrNewCall = TalkOrNewCall;
