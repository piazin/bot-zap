"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenNewTicket = void 0;
const deleteImage_1 = require("../utils/deleteImage");
const openIa_service_1 = require("../services/openIa.service");
const storage_service_1 = require("../services/storage.service");
const sendEmail_service_1 = require("../services/sendEmail.service");
class OpenNewTicket {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message, }) {
        try {
            this.storageService.setUserEmail(message.body);
            this.userEmail = message.body;
            this.content = this.storageService.getProblemOrRequestMessage();
            this.userName = message.sender.pushname;
            this.emailTo =
                process.env.NODE_ENV === 'production'
                    ? 'ti@slpart.com.br'
                    : this.userEmail;
            this.attachments = this.storageService.getPathSuportImg()
                ? this.storageService.getPathSuportImg()
                : null;
            client.sendText(to, 'Estamos abrindo seu chamado, por favor, aguarde um momento enquanto processamos as informações.');
            const requestOrIncident = await new openIa_service_1.OpenIaService().createCompletion(`isto é uma requisição ou incidente? \n ${this.content}, \n Responda apenas com requisição ou incidente`);
            const matchLetter = requestOrIncident
                ?.toLowerCase()
                .match(/\b(incidente|requisição)\b/g);
            if (!matchLetter) {
                this.sendTicketEmail();
                return;
            }
            this.subject = matchLetter[0] === 'requisição' ? 'requisicao' : '';
            await this.sendEmailToSupport();
            client.sendText(to, 'Seu chamado foi aberto com sucesso! Em breve você receberá atualizações sobre o status do chamado. Obrigado!');
            if (this.storageService.getPathSuportImg())
                (0, deleteImage_1.deleteImage)(this.storageService.getPathSuportImg());
            this.storageService.setStage(0);
            this.storageService.setTicket(false);
            this.storageService.setPathSuportImg(null);
        }
        catch (error) {
            console.error('Error opening new ticket:', error);
            await client.sendText(to, 'Falha ao enviar o ticket, tente novamente mais tarde.');
        }
    }
    async sendTicketEmail() {
        await sendEmail_service_1.sendEmailService.execute({
            to: this.emailTo,
            cc: this.userEmail,
            user_name: this.userName,
            content: this.content,
            attachment: this.attachments,
        });
    }
    async sendEmailToSupport() {
        await sendEmail_service_1.sendEmailService.execute({
            to: this.emailTo,
            cc: this.userEmail,
            subject: this.subject,
            user_name: this.userName,
            content: this.content,
            attachment: this.attachments,
        });
    }
}
exports.OpenNewTicket = OpenNewTicket;
