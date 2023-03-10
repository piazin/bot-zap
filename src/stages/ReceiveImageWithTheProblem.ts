import { storage } from '../storage';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

class ReceiveImageWithTheProblem {
  execute({ to, client, message }: IStageParameters): void | string {
    try {
      client.sendText(
        to,
        'Deseja enviar alguma imagem do problema? Se sim, favor encaminhar apenas uma imagem, caso contrario, digite não.'
      );
      if (storage[to].isTicket) {
        storage[to].stage = 5;
        return message.body;
      }

      storage[to].stage = 3;
      return message.body;
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      return invalidOption.execute({ to, client });
    }
  }
}

export const receiveImageWithTheProblem = new ReceiveImageWithTheProblem();
