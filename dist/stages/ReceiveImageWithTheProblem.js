"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveImageWithTheProblem = void 0;
const storage_1 = require("../storage");
const invalidOption_1 = require("./invalidOption");
class ReceiveImageWithTheProblem {
    execute({ to, client, message }) {
        try {
            client.sendText(to, 'Deseja enviar alguma imagem do problema? Se sim, favor encaminhar apenas uma imagem, caso contrario, digite não.');
            if (storage_1.storage[to].isTicket) {
                storage_1.storage[to].stage = 5;
                return message.body;
            }
            storage_1.storage[to].stage = 3;
            return message.body;
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.receiveImageWithTheProblem = new ReceiveImageWithTheProblem();
