import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantList } from '../constants/attendantList';
import { downloadingImage } from '../utils/downloadingImage';

class SendAttendantList {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    await downloadingImage(client, message);

    client.sendListMenu(
      to,
      'Atendentes disponiveis',
      'Selecione um:',
      'Clique para selecionar',
      attendantList
    );
    storage[to].stage = 4;
  }
}

export const sendAttendantList = new SendAttendantList();
