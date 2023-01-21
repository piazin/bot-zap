import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantList } from '../constants/attendantList';
import { downloadingImg } from '../services/download_img.service';

class SendAttendantList {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    if (message.isMedia || message.isMMS) {
      storage[to].pathSuportImg = await downloadingImg.execute(
        client,
        message,
        to
      );
    }

    client.sendListMenu(
      to,
      'Selecione um atendente',
      '',
      'Clique para selecionar',
      attendantList
    );
    storage[to].stage = 4;
  }
}

export const sendAttendantList = new SendAttendantList();
