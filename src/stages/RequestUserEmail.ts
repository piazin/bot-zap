import { storage } from '../storage';
import { downloadingImg } from '../services/download_img.service';
import { IStageParameters } from './stage.dto';

class RequestUserEmail {
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

    client.sendText(to, 'Qual seu email?');
    storage[to].stage = 6;
    return message.body;
  }
}

export const requestUserEmail = new RequestUserEmail();
