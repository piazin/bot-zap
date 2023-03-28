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
          nextStage: 7,
          toLeave: true,
        },
        '4': {
          text: 'Descreva com detalhes a imagem que deseja.',
          isTicket: false,
          nextStage: 8,
          toLeave: true,
        },
      };

      var selectedOption = parseInt(message.body);

      if (message.mimetype === 'audio/ogg; codecs=opus') {
        const audioPath = await this.fileService.downloadFile();
        const audioText = await this.speechToText.execute(audioPath);
        console.log('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ audioText:', audioText);
        const response = await this.openIaService.createCompletion(
          `Baseado neste neste texto \n ${audioText} \n Qual dessas respostas se enquadra melhor? \n 1 - Abrir um novo chamado 2 - Falar com um de nossos atendentes 3 - Converse com chat GPT3! 4 - Gerar imagem, usando a IA DALL-E! \n Caso encontre me devolta apenas o numero da resposta caso não acha nenhuma opção parecida devolva 0`
        );

        selectedOption = parseInt(response.replace('.', ''));
      }

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
    }
  }
}
