import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';
import { StorageService } from '../services/storage.service';
import { FileService } from '../services/file.service';
import { SpeechToText } from '../apis/SpeechToText';
import { storage } from '../storage';

const OPTIONS = {
  '1': {
    text: 'Para abrir um novo chamado, por favor, descreva o problema, dúvida ou requisição que você deseja fazer.',
    isTicket: true,
    nextStage: 2,
  },
  '2': {
    text: 'Faça uma breve descrição do problema que está enfretando...',
    isTicket: false,
    nextStage: 2,
  },
  '3': {
    text: 'Qual sua pergunta?',
    isTicket: false,
    nextStage: 8,
    toLeave: true,
  },
  '4': {
    text: 'Oque deseja saber sobre a empressa?',
    isTicket: false,
    nextStage: 9,
    toLeave: true,
  },
};

export class TalkOrNewCall {
  private readonly storageService: StorageService;
  private readonly speechToText: SpeechToText;
  private fileService: FileService;

  constructor(to: string) {
    this.storageService = new StorageService(to, storage);
    this.speechToText = new SpeechToText();
  }

  async execute({ to, client, message }: IStageParameters) {
    this.fileService = new FileService(client, message);

    try {
      await client.startTyping(to);

      let { body: userMessage, mimetype } = message;

      if (mimetype === 'audio/ogg; codecs=opus') {
        const audioText = await this.convertSpeechToText();
        userMessage = audioText;
      }

      const selectedOption = parseInt(userMessage.replace(/[^0-9]/g, ''));

      const option = OPTIONS[selectedOption] ?? null;

      if (!option) {
        return invalidOption.execute({ to, client });
      }

      if (option.toLeave) await client.sendText(to, 'Para encerrar o chat digite #sair');

      await client.sendText(to, option.text);
      this.storageService.setStage(option.nextStage);
      this.storageService.setTicket(option.isTicket);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      return invalidOption.execute({ to, client });
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
}
