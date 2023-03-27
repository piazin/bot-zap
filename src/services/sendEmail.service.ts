import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

interface ISendEmail {
  to: string;
  cc?: string;
  content: string;
  subject?: string;
  user_name: string;
  ticketNumber: number;
  attachment?: string;
}

class SendEmailService {
  async execute({
    to,
    user_name,
    content,
    attachment,
    subject,
    cc,
  }: ISendEmail) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'suporte2@slpart.com.br',
        pass: process.env.EMAIL_KEY,
      },
    });

    let thereIsAttachment: string;
    if (attachment) {
      thereIsAttachment = path.basename(attachment);
    }

    const configMail = {
      from: {
        name: 'Suport Bot',
        address: 'suporte2@slpart.com.br',
      },
      to,
      cc,
      subject: ` ${
        subject
          ? `${subject}: Novo chamado recebido!`
          : 'Seu chamado foi recebido com sucesso'
      } `,
      html: await returnEmailTemplate(
        content,
        user_name,
        to,
        thereIsAttachment
      ),
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

var returnEmailTemplate = async (
  content: string,
  userName: string,
  userEmail: string,
  thereIsAttachment: string
) => {
  var emailTemplate = await fs.readFile(
    path.resolve('./src/public/email.html'),
    {
      encoding: 'utf-8',
    }
  );

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

  return Object.entries(replacements).reduce(
    (template, [placeholder, replacement]) =>
      template.replace(new RegExp(placeholder, 'g'), replacement),
    emailTemplate
  );
};

export const sendEmailService = new SendEmailService();
