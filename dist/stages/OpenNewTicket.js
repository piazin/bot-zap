"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openNewTicket = void 0;
const storage_1 = require("../storage");
const send_email_service_1 = require("../services/send_email.service");
class OpenNewTicket {
    async execute({ to, client, message, messageResponse, }) {
        storage_1.storage[to].userEmail = message.body;
        client.sendText(to, 'Estamos abrindo seu chamado... Aguarde um momento.');
        await send_email_service_1.sendEmailService.execute({
            to: storage_1.storage[to].userEmail,
            user_name: message.sender.pushname,
            content: messageResponse,
            attachment: storage_1.storage[to].pathSuportImg ? storage_1.storage[to].pathSuportImg : null,
        });
        client.sendText(to, 'Chamado aberto com sucesso! Em breve você recebera atualizações do seu chamado, obrigado.');
        storage_1.storage[to].stage = 0;
        storage_1.storage[to].isTicket = false;
        storage_1.storage[to].pathSuportImg = null;
    }
}
exports.openNewTicket = new OpenNewTicket();
