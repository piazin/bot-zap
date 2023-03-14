import { storage } from '../storage';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

class TalkOrNewCall {
  async execute({ to, client, message }: IStageParameters) {
    try {
      if (!message.listResponse) return invalidOption.execute({ to, client });

      const options = {
        '1': {
          text: 'Muito bem para abrir um novo chamado, preciso que você me descreva o problema, duvida ou requisição que deseja fazer.',
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

      const selectedOption =
        message.listResponse?.singleSelectReply?.selectedRowId;

      const option = options[selectedOption];

      if (!option) {
        return invalidOption.execute({ to, client });
      }

      if (option.toLeave)
        await client.sendText(to, 'Para encerrar o chat digite #sair');

      await client.sendText(to, option.text);
      storage[to].stage = option.nextStage;
      storage[to].isTicket = option.isTicket;
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      return invalidOption.execute({ to, client });
    }
  }
}

export const talkOrNewCall = new TalkOrNewCall();
