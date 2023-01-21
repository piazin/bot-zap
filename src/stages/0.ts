import { IStageParameters } from './stage.dto';
import { storage } from '../storage';

class StageZero {
  execute({ from, client, message }: IStageParameters): void | string {
    storage[from].stage = 1;
    client.sendText(
      from,
      `Olá ${message.sender.pushname}, \n\nEu sou o Cib, IA do T.I. Em que posso ajudar?\n1 - Abrir um novo chamado \n2 - Falar com um de nossos atendentes`
    );
  }
}

export const stageZero = new StageZero();
