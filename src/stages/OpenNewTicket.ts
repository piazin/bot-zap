import { IStageParameters } from './stage.dto';
import { deleteImage } from '../utils/deleteImage';
import { SpeechToText } from '../apis/SpeechToText';
import { FileService } from '../services/file.service';
import { OpenIaService } from '../services/openIa.service';
import { StorageService } from '../services/storage.service';
import { ResponseService } from '../services/response.service';
import { sendEmailService } from '../services/sendEmail.service';

let openingTicket = false;

export class OpenNewTicket {
  private emailTo: string;
  private content: string;
  private subject: string;
  private userName: string;
  private attachments: any;
  private userEmail: string;
  private ticketNumber: string;

  private fileService: FileService;
  private readonly speechToText: SpeechToText;
  private readonly openIaService: OpenIaService;
  private readonly storageService: StorageService;
  private readonly responseService: ResponseService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.speechToText = new SpeechToText();
    this.responseService = new ResponseService();
    this.openIaService = new OpenIaService();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    this.fileService = new FileService(client, message);

    try {
      if (openingTicket) return;

      await client.startTyping(to);

      let userMessage = message.body;
      if (message.mimetype === 'audio/ogg; codecs=opus')
        userMessage = await this.convertSpeechToText();

      const isEmailHasBeenConfirmed = await this.getEmailConfirmation(userMessage);

      if (isEmailHasBeenConfirmed === 0) {
        this.storageService.setStage(6);
        await client.sendText(to, 'Muito bem, qual é o e-mail correto?');
        return;
      }

      openingTicket = true;

      this.userName = message.sender.pushname;
      this.ticketNumber = this.generateTicketNumber();
      this.userEmail = this.storageService.getUserEmail();
      this.content = this.storageService.getProblemOrRequestMessage();
      this.emailTo = process.env.NODE_ENV === 'production' ? 'ti@slpart.com.br' : this.userEmail;
      this.attachments = this.storageService.getPathSuportImg()
        ? this.storageService.getPathSuportImg()
        : null;

      const replyMessage = this.responseService.getRandomAnswer('opennewticket');
      client.sendText(to, replyMessage);

      await this.getTicketType();
      await this.sendTicketEmail();
      await this.sendEmailToSupport();

      client.sendText(
        to,
        'Seu chamado foi aberto com sucesso! Em breve você receberá atualizações sobre o status do chamado. Obrigado!'
      );

      if (this.storageService.getPathSuportImg())
        deleteImage(this.storageService.getPathSuportImg());

      this.storageService.clear();
    } catch (error) {
      console.error('Error opening new ticket:', error);
      await client.sendText(to, 'Falha ao enviar o ticket, tente novamente mais tarde.');
    } finally {
      await client.stopTyping(to);
    }
  }

  private async convertSpeechToText(): Promise<string> {
    const audioPath = await this.fileService.downloadFile();
    const audioText = await this.speechToText.execute(audioPath);
    await this.fileService.deleteFile(audioPath);

    return audioText;
  }

  private async getTicketType(): Promise<void> {
    let requestOrIncident = await this.openIaService.createCompletion(
      `isto é uma requisição ou incidente? \n ${this.content}, \n Responda apenas com requisição ou incidente`
    );

    const matchLetter: RegExpMatchArray | null = requestOrIncident
      ?.toLowerCase()
      .match(/\b(incidente|requisição)\b/g);

    requestOrIncident = matchLetter[0] === 'requisição' ? 'requisicao' : '';
    this.subject = `${requestOrIncident}: Novo chamado recebido ${this.ticketNumber}`;
  }

  private async sendTicketEmail() {
    await sendEmailService.execute({
      to: this.userEmail,
      cc: this.emailTo,
      subject: this.subject,
      user_name: this.userName,
      content: this.content,
      attachment: this.attachments,
      ticketNumber: this.ticketNumber,
      htmlTemplateName: 'emailUserNewTicket',
    });
  }

  private async sendEmailToSupport() {
    await sendEmailService.execute({
      to:
        process.env.NODE_ENV === 'production' ? 'suporte2@slpart.com.br' : 'suporte2@slpart.com.br',
      subject: this.subject,
      user_name: this.userName,
      content: this.content,
      attachment: this.attachments,
      ticketNumber: this.ticketNumber,
      htmlTemplateName: 'email',
    });
  }

  private generateTicketNumber(): string {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return String(randomNumber);
  }

  private async getEmailConfirmation(userMessage: string): Promise<number> {
    const response = await this.openIaService.createCompletion(
      `Está frase é uma confirmação ou uma negação? \n\n ${userMessage} \n\n Caso seja uma confirmação retorne 1 caso seja uma negação, ou um erro retorne 0, retorne apenas o numero`
    );

    const isEmailHasBeenConfirmed = response.replace(/[^0-9]/g, '');

    return parseInt(isEmailHasBeenConfirmed);
  }
}
