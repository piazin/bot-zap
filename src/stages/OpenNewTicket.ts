import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { sendEmailService } from '../services/send_email.service';
import { OpenIaService } from '../services/open_ia.service';
import { deleteImage } from '../utils/deleteImage';
import { invalidOption } from './invalidOption';

class OpenNewTicket {
  private emailTo: string;
  private content: string;
  private subject: string;
  private userName: string;
  private userEmail: string;
  private attachments;

  async execute({
    to,
    client,
    message,
    messageResponse,
  }: IStageParameters): Promise<void | string> {
    try {
      storage[to].userEmail = message.body;
      this.userEmail = message.body;
      this.content = messageResponse;
      this.userName = message.sender.pushname;
      this.emailTo =
        process.env.NODE_ENV === 'production'
          ? 'ti@slpart.com.br'
          : storage[to].userEmail;

      this.attachments = storage[to].pathSuportImg
        ? storage[to].pathSuportImg
        : null;

      client.sendText(to, 'Estamos abrindo seu chamado... Aguarde um momento.');

      const requestOrIncident = await new OpenIaService().createCompletion(
        `isto é uma requisição ou incidente? \n ${messageResponse}, \n Responda apenas com requisição ou incidente`
      );

      console.log('Request or Incident:', requestOrIncident);

      const matchLetter: RegExpMatchArray | null = requestOrIncident
        ?.toLowerCase()
        .match(/\b(incidente|requisição)\b/g);

      if (!matchLetter) {
        this.sendTicketEmail();
        return;
      }

      console.log('Matched letters:', matchLetter);

      this.subject = matchLetter[0] === 'requisição' ? 'requisicao' : '';

      this.sendTicketEmail();

      if (process.env.NODE_ENV === 'production') this.sendTicketEmail();

      client.sendText(
        to,
        'Chamado aberto com sucesso! Em breve você recebera atualizações do seu chamado, obrigado.'
      );

      if (storage[to].pathSuportImg) deleteImage(storage[to].pathSuportImg);

      storage[to].stage = 0;
      storage[to].isTicket = false;
      storage[to].pathSuportImg = null;
    } catch (error) {
      console.error('Error opening new ticket:', error);
      return invalidOption.execute({ to, client });
    }
  }

  private async sendTicketEmail() {
    await sendEmailService.execute({
      to: this.emailTo,
      cc: this.userEmail,
      user_name: this.userName,
      content: this.content,
      attachment: this.attachments,
    });
  }

  private async sendEmailToSupport() {
    await sendEmailService.execute({
      to: this.emailTo,
      cc: this.userEmail,
      subject: this.subject,
      user_name: this.userName,
      content: this.content,
      attachment: this.attachments,
    });
  }
}

export const openNewTicket = new OpenNewTicket();
