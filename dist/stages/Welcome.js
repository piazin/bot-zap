"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = void 0;
const storage_1 = require("../storage");
const firstOptions_1 = require("../constants/firstOptions");
const invalidOption_1 = require("./invalidOption");
class Welcome {
    async execute({ to, client, message, }) {
        try {
            await client.sendText(to, `Olá ${message.sender.pushname}, \n\nEu sou o Cib, seu assistente virtual do T.I SL.\n\nEm que posso ajudar? 🤖\n`);
            await client.sendListMenu(to, 'Por favor, selecione uma das opções.', '', 'selecionar', firstOptions_1.firstOptions);
            storage_1.storage[to].stage = 1;
        }
        catch (error) {
            console.error('🚀 ~ file: Welcome.ts:28 ~ Welcome ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.welcome = new Welcome();
