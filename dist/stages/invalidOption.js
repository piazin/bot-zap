"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidOption = void 0;
class InvalidOption {
    async execute({ to, client }) {
        await client.sendText(to, 'Por favor, envie uma opção valida.');
    }
}
exports.invalidOption = new InvalidOption();
