import { OpenIaService } from '../services/open_ia.service';
import { storage } from '../storage';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

class ChatWithGPT3 {
  async execute({ to, client, message }: IStageParameters) {
    try {
      if (message.body === '#sair') {
        client.sendText(
          to,
          `Foi um prazer atende-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma  dúvida pode sempre me procurar! Obrigado.`
        );
        storage[to].stage = 0;
        return;
      }

      client.startTyping(to);
      const response = await new OpenIaService().createCompletion(message.body);
      await client.sendText(to, response);
      await client.stopTyping(to);

      var timeState = setTimeout(() => {
        storage[to].stage = 0;
      }, 600000);

      timeState.refresh();
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      return invalidOption.execute({ to, client });
    }
  }
}

export const chatWithGPT3 = new ChatWithGPT3();
