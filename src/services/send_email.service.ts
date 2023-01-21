import nodemailer from 'nodemailer';

interface ISendEmail {
  to: string;
  content: string;
  attachment?: string;
}

class SendEmailService {
  async execute({ to, content, attachment }: ISendEmail) {
    console.log(
      '🚀 ~ file: send_email.service.ts:11 ~ SendEmailService ~ execute ~ attachment',
      attachment
    );
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'suporte2@slpart.com.br',
          pass: 'ieuurejtuiostalk',
        },
      });

      let thereIsAttachment: string;
      if (attachment) {
        thereIsAttachment = attachment.split('/')[1];
      }

      const configMail = {
        from: {
          name: 'Suport Bot',
          address: 'suporte2@slpart.com.br',
        },
        to: to,
        subject: 'Novo chamado',
        html: `
          <h1>New Call</h1>
          ${
            thereIsAttachment
              ? `<img src="cid:${thereIsAttachment}" width="30%"
          height="30%">`
              : ''
          }
        `,
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
    } catch (error) {
      console.error(error);
    }
  }
}

export const sendEmailService = new SendEmailService();
