import { OpenIaService } from '../services/open_ia.service';
import { IStageParameters } from './stage.dto';

class ChatWithGPT3 {
  async execute({ to, client, message }: IStageParameters) {
    client.startTyping(to);
    const response = await new OpenIaService().execute(message.body);
    await client.sendText(to, response);
    await client.stopTyping(to);
  }
}

export const chatWithGPT3 = new ChatWithGPT3();
