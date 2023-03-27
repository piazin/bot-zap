import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';
import { StorageService } from '../services/storage.service';

export class TalkOrNewCall {
  private readonly storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({ to, client, message }: IStageParameters) {
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

      const selectedOption = parseInt(message.body);

      const option = options[selectedOption];

      if (!option) {
        return invalidOption.execute({ to, client });
      }

      if (option.toLeave)
        await client.sendText(to, 'Para encerrar o chat digite #sair');

      await client.sendText(to, option.text);
      this.storageService.setStage(option.nextStage);
      this.storageService.setTicket(option.isTicket);
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      return invalidOption.execute({ to, client });
    }
  }
}
