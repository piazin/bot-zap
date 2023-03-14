import { storage } from '../storage';
import { downloadingImg } from '../services/downloadImg.service';
import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';

const ACCEPTED_MIME_TYPES = ['image/jpeg', undefined];

class RequestUserEmail {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<string | void> {
    try {
      if (!ACCEPTED_MIME_TYPES.includes(message.mimetype)) {
        await invalidOption.execute({ to, client });
        return;
      }

      if (message.isMedia || message.isMMS) {
        storage[to].pathSuportImg = await downloadingImg.execute(
          client,
          message
        );
      }

      await client.sendText(to, 'Qual é o seu e-mail?');
      storage[to].stage = 6;
      return message.body;
    } catch (error) {
      console.error(`Error in RequestUserEmail.execute: ${error}`);
      await invalidOption.execute({ to, client });
    }
  }
}

export const requestUserEmail = new RequestUserEmail();
