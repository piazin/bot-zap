"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openNewTicket = void 0;
const storage_1 = require("../storage");
const send_email_service_1 = require("../services/send_email.service");
const open_ia_service_1 = require("../services/open_ia.service");
class OpenNewTicket {
    async execute({ to, client, message, messageResponse, }) {
        storage_1.storage[to].userEmail = message.body;
        var subject = '';
        client.sendText(to, 'Estamos abrindo seu chamado... Aguarde um momento.');
        const requestOrIncident = await new open_ia_service_1.OpenIaService().createCompletion(`isto é uma requisição ou incidente? \n ${messageResponse}`);
        if (requestOrIncident) {
            const matchLetter = requestOrIncident?.match(/\b(incidente|requisição)\b/g);
            if (matchLetter) {
                subject =
                    matchLetter[0] === 'requisição'
                        ? 'requisicao'
                        : 'incidente';
            }
        }
        await send_email_service_1.sendEmailService.execute({
            to: storage_1.storage[to].userEmail,
            subject: subject || '',
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
