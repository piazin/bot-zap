import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantList } from '../constants/attendantList';

class StageTwo {
  execute({ from, client, message }: IStageParameters): void | string {
    client.sendListMenu(
      from,
      'Atendentes disponiveis',
      'Selecione um:',
      'Clique para selecionar',
      attendantList
    );
    storage[from].stage = 3;

    return message.body;
  }
}

export const stageTwo = new StageTwo();
