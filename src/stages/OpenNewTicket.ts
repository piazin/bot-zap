import { IStageParameters } from './stage.dto';
import { deleteImage } from '../utils/deleteImage';
import { OpenIaService } from '../services/openIa.service';
import { StorageService } from '../services/storage.service';
import { sendEmailService } from '../services/sendEmail.service';
import { SpeechToText } from '../apis/SpeechToText';
import { FileService } from '../services/file.service';
import { ResponseService } from '../services/response.service';

export class OpenNewTicket {
  private emailTo: string;
  private content: string;
  private subject: string;
  private userName: string;
  private attachments: any;
  private userEmail: string;
  private ticketNumber: number;

  private fileService: FileService;
  private readonly speechToText: SpeechToText;
  private readonly storageService: StorageService;
  private readonly responseService: ResponseService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.speechToText = new SpeechToText();
    this.responseService = new ResponseService('OpenNewTicket');
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    this.fileService = new FileService(client, message);

    try {
      let userEmail = message.body;

      if (message.mimetype === 'audio/ogg; codecs=opus')
        userEmail = await this.convertSpeechToText();

      this.userEmail = userEmail;
      this.userName = message.sender.pushname;
      this.storageService.setUserEmail(userEmail);
      this.ticketNumber = this.generateTicketNumber();
      this.content = this.storageService.getProblemOrRequestMessage();
      this.emailTo = process.env.NODE_ENV === 'production' ? 'ti@slpart.com.br' : this.userEmail;
      this.attachments = this.storageService.getPathSuportImg()
        ? this.storageService.getPathSuportImg()
        : null;

      client.sendText(
        to,
        'Estamos abrindo seu chamado, por favor, aguarde um momento enquanto processamos as informações.'
      );

      await this.getCallType();

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
    }
  }

  private async convertSpeechToText(): Promise<string> {
    const audioPath = await this.fileService.downloadFile();
    const audioText = await this.speechToText.execute(audioPath);
    await this.fileService.deleteFile(audioPath);

    return audioText;
  }

  private async getCallType(): Promise<void> {
    const requestOrIncident = await new OpenIaService().createCompletion(
      `isto é uma requisição ou incidente? \n ${this.content}, \n Responda apenas com requisição ou incidente`
    );

    const matchLetter: RegExpMatchArray | null = requestOrIncident
      ?.toLowerCase()
      .match(/\b(incidente|requisição)\b/g);

    this.subject = matchLetter[0] === 'requisição' ? 'requisicao' : '';
  }

  private async sendTicketEmail() {
    await sendEmailService.execute({
      to: this.emailTo,
      cc: this.userEmail,
      user_name: this.userName,
      content: this.content,
      attachment: this.attachments,
      ticketNumber: this.ticketNumber,
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
      ticketNumber: this.ticketNumber,
    });
  }

  private generateTicketNumber(): number {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
  }
}
