import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';
import { StorageService } from '../services/storage.service';
import { FileService } from '../services/file.service';
import { OpenIaService } from '../services/openIa.service';
import { SpeechToText } from '../apis/SpeechToText';

export class TalkOrNewCall {
  private readonly storageService: StorageService;
  private readonly openIaService: OpenIaService;
  private readonly speechToText: SpeechToText;
  private fileService: FileService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.openIaService = new OpenIaService();
    this.speechToText = new SpeechToText();
  }

  async execute({ to, client, message }: IStageParameters) {
    this.fileService = new FileService(client, message);

    try {
      await client.startTyping(to);

      const options = {
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

      let userMessage = message.body;

      if (message.mimetype === 'audio/ogg; codecs=opus') {
        const audioText = await this.convertSpeechToText();
        userMessage = audioText;
      }

      const response = await this.openIaService.createCompletion(
        `Baseado neste neste texto 
          
          ${userMessage}  
          
          Qual dessas opções o usuario precisa?
          
          1 - Abrir um novo chamado 
          2 - Falar ou se conectar com um de nossos atendentes, Sergio, Andrey, Hernando, Lucas
          3 - Conversar com chat GPT ou Gpp ou pt ou gt ou GBT 
          4 - Informações sobre a empressa SL
          
        Me responda com o numero da ação`
      );

      const selectedOption = parseInt(response.replace(/[^0-9]/g, ''));
      const option = options[selectedOption];

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
