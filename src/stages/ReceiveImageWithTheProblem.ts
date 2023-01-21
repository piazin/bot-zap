import { storage } from '../storage';
import { IStageParameters } from './stage.dto';

class ReceiveImageWithTheProblem {
  execute({ to, client, message }: IStageParameters): void | string {
    client.sendText(
      to,
      'Deseja enviar alguma imagem do problema? Se sim, favor encaminhar apenas uma imagem, caso não, digite não.'
    );
    if (storage[to].isTicket) {
      storage[to].stage = 5;
      return message.body;
    }

    storage[to].stage = 3;
    return message.body;
  }
}

export const receiveImageWithTheProblem = new ReceiveImageWithTheProblem();
