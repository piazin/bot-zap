import { IStageParameters } from './stage.dto';
import { deleteImage } from '../utils/deleteImage';
import { OpenIaService } from '../services/openIa.service';
import { StorageService } from '../services/storage.service';
import { sendEmailService } from '../services/sendEmail.service';

export class OpenNewTicket {
  private emailTo: string;
  private content: string;
  private subject: string;
  private userName: string;
  private userEmail: string;
  private attachments;

  private storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
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

      client.sendText(
        to,
        'Estamos abrindo seu chamado, por favor, aguarde um momento enquanto processamos as informações.'
      );

      const requestOrIncident = await new OpenIaService().createCompletion(
        `isto é uma requisição ou incidente? \n ${this.content}, \n Responda apenas com requisição ou incidente`
      );

      const matchLetter: RegExpMatchArray | null = requestOrIncident
        ?.toLowerCase()
        .match(/\b(incidente|requisição)\b/g);

      if (!matchLetter) {
        this.sendTicketEmail();
        return;
      }

      this.subject = matchLetter[0] === 'requisição' ? 'requisicao' : '';

      await this.sendEmailToSupport();

      client.sendText(
        to,
        'Seu chamado foi aberto com sucesso! Em breve você receberá atualizações sobre o status do chamado. Obrigado!'
      );

      if (this.storageService.getPathSuportImg())
        deleteImage(this.storageService.getPathSuportImg());

      this.storageService.setStage(0);
      this.storageService.setTicket(false);
      this.storageService.setPathSuportImg(null);
    } catch (error) {
      console.error('Error opening new ticket:', error);
      await client.sendText(
        to,
        'Falha ao enviar o ticket, tente novamente mais tarde.'
      );
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
