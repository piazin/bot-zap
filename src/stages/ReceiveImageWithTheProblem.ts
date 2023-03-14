import { storage } from '../storage';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

class ReceiveImageWithTheProblem {
  async execute({ to, client, message }: IStageParameters): Promise<void> {
    try {
      client.sendText(
        to,
        'Deseja enviar alguma imagem do problema? Se sim, favor encaminhar apenas uma imagem, caso contrario, digite não.'
      );

      storage[to].problemOrRequestMessage = message.body;

      storage[to].stage = storage[to].isTicket ? 5 : 3;
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      await invalidOption.execute({ to, client });
    }
  }
}

export const receiveImageWithTheProblem = new ReceiveImageWithTheProblem();
