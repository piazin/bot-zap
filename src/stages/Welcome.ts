import { IStageParameters } from './stage.dto';
import { storage } from '../storage';

class Welcome {
  execute({ to, client, message }: IStageParameters): void | string {
    client.sendText(
      to,
      `Olá ${message.sender.pushname}, \n\nEu sou o Cib 🤖, seu assistente virtual do T.I SL.\nEm que posso ajudar?\n\n1 - Abrir um novo chamado \n2 - Falar com um de nossos atendentes`
    );
    storage[to].stage = 1;
  }
}

export const welcome = new Welcome();
