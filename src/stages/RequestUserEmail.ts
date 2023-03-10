import { storage } from '../storage';
import { downloadingImg } from '../services/download_img.service';
import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';

class RequestUserEmail {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    try {
      var mimetypeaccepted = ['image/jpeg', undefined];

      if (!mimetypeaccepted.includes(message.mimetype)) {
        invalidOption.execute({ to, client });
        return;
      }

      if (message.isMedia || message.isMMS) {
        storage[to].pathSuportImg = await downloadingImg.execute(
          client,
          message,
          to
        );
      }

      client.sendText(to, 'Qual seu email?');
      storage[to].stage = 6;
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

export const requestUserEmail = new RequestUserEmail();
