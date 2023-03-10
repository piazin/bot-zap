import { storage } from '../storage';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

class TalkOrNewCall {
  async execute({ to, client, message }: IStageParameters) {
    try {
      if (!message.listResponse) return invalidOption.execute({ to, client });

      const selectedOption =
        message.listResponse?.singleSelectReply?.selectedRowId;

      switch (selectedOption) {
        case '1':
          client.sendText(
            to,
            'Muito bem para abrir um novo chamado, preciso que você me descreva o problema, duvida ou requisição que deseja fazer.'
          );
          storage[to].stage = 2;
          storage[to].isTicket = true;
          break;
        case '2':
          client.sendText(
            to,
            'Faça uma breve descrição do problema que está enfretando...'
          );
          storage[to].stage = 2;
          break;
        case '3':
          await client.sendText(
            to,
            'Para encerrar o chat digite #sair a qualquer momento.'
          );
          await client.sendText(to, 'Qual sua pergunta?');
          storage[to].stage = 7;
          break;

        case '4':
          await client.sendText(
            to,
            'Para encerrar o chat digite #sair a qualquer momento.'
          );
          await client.sendText(
            to,
            'Descreva com detalhes a imagem que deseja.'
          );
          storage[to].stage = 8;
          break;

        default:
          invalidOption.execute({ to, client });
      }
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
