"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidOption = void 0;
class InvalidOption {
    execute({ to, client }) {
        client.sendText(to, 'Por favor, envie uma opção valida.');
    }
}
exports.invalidOption = new InvalidOption();
