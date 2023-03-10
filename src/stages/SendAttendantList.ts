import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantList } from '../constants/attendantList';
import { downloadingImg } from '../services/download_img.service';
import { invalidOption } from './invalidOption';

class SendAttendantList {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    try {
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
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      return invalidOption.execute({ to, client });
    }
  }
}

export const sendAttendantList = new SendAttendantList();
