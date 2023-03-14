"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class SendEmailService {
    async execute({ to, user_name, content, attachment, subject, cc, }) {
        let transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'suporte2@slpart.com.br',
                pass: process.env.EMAIL_KEY,
            },
        });
        let thereIsAttachment;
        if (attachment) {
            thereIsAttachment = path_1.default.basename(attachment);
        }
        const configMail = {
            from: {
                name: 'Suport Bot',
                address: 'suporte2@slpart.com.br',
            },
            to,
            cc,
            subject: ` ${subject
                ? `${subject}: Novo chamado recebido!`
                : 'Seu chamado foi recebido com sucesso'} `,
            html: await returnEmailTemplate(content, user_name, to, thereIsAttachment),
            attachments: attachment
                ? [
                    {
                        filename: thereIsAttachment,
                        path: attachment,
                        cid: thereIsAttachment,
                    },
                ]
                : null,
        };
        await transporter.sendMail(configMail);
    }
}
var returnEmailTemplate = async (content, userName, userEmail, thereIsAttachment) => {
    var emailTemplate = await promises_1.default.readFile(path_1.default.resolve('./src/public/email.html'), {
        encoding: 'utf-8',
    });
    var dateAndHours = new Date().toLocaleString('pt-BR');
    var widthAttachment = thereIsAttachment ? '60%' : '0%';
    const replacements = {
        '{content}': content,
        '{userName}': userName,
        '{userEmail}': userEmail,
        '{ticketNumber}': '12345',
        '{dateAndHours}': dateAndHours,
        '{widthAttachment}': widthAttachment,
        '{thereIsAttachment}': thereIsAttachment,
    };
    return Object.entries(replacements).reduce((template, [placeholder, replacement]) => template.replace(new RegExp(placeholder, 'g'), replacement), emailTemplate);
};
exports.sendEmailService = new SendEmailService();
