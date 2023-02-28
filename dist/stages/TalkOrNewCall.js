"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.talkOrNewCall = void 0;
const storage_1 = require("../storage");
const invalidOption_1 = require("./invalidOption");
class TalkOrNewCall {
    async execute({ to, client, message }) {
        switch (message.body.replace(' ', '')) {
            case '1':
                client.sendText(to, 'Muito bem para abrir um novo chamado, preciso que você me descreva o problema, duvida ou requisição que deseja fazer.');
                storage_1.storage[to].stage = 2;
                storage_1.storage[to].isTicket = true;
                break;
            case '2':
                client.sendText(to, 'Faça uma breve descrição do problema que está enfretando...');
                storage_1.storage[to].stage = 2;
                break;
            case '3':
                await client.sendText(to, 'Para encerrar o chat digite #sair a qualquer momento.');
                await client.sendText(to, 'Qual sua pergunta?');
                storage_1.storage[to].stage = 7;
                break;
            default:
                invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.talkOrNewCall = new TalkOrNewCall();
