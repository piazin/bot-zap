import { storage } from '../storage';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

class TalkOrNewCall {
  execute({ to, client, message }: IStageParameters) {
    switch (message.body.replace(' ', '')) {
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
      default:
        invalidOption.execute({ to, client });
    }
  }
}

export const talkOrNewCall = new TalkOrNewCall();
