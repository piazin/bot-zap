"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveImageWithTheProblem = void 0;
const storage_1 = require("../storage");
class ReceiveImageWithTheProblem {
    execute({ to, client, message }) {
        client.sendText(to, 'Deseja enviar alguma imagem do problema? Se sim, favor encaminhar apenas uma imagem, caso contrario, digite não.');
        if (storage_1.storage[to].isTicket) {
            storage_1.storage[to].stage = 5;
            return message.body;
        }
        storage_1.storage[to].stage = 3;
        return message.body;
    }
}
exports.receiveImageWithTheProblem = new ReceiveImageWithTheProblem();
