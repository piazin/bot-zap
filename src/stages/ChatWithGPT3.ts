import { OpenIaService } from '../services/openIa.service';
import { storage } from '../storage';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

class ChatWithGPT3 {
  private static readonly MAX_IDLE_TIME_MS = 600000;

  async execute({ to, client, message }: IStageParameters) {
    try {
      if (message.body === '#sair') {
        const farewellMessage = `Foi um prazer atendê-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma dúvida pode sempre me procurar! Obrigado.`;
        await client.sendText(to, farewellMessage);
        storage[to].stage = 0;
        return;
      }

      client.startTyping(to);
      const response = await new OpenIaService().createCompletion(message.body);
      await client.sendText(to, response);
      await client.stopTyping(to);

      const idleTimeout = setTimeout(() => {
        storage[to].stage = 0;
      }, ChatWithGPT3.MAX_IDLE_TIME_MS);

      idleTimeout.refresh();
    } catch (error) {
      console.error(`Error in ChatWithGPT3.execute: ${error}`);
      await invalidOption.execute({ to, client });
    }
  }
}

export const chatWithGPT3 = new ChatWithGPT3();
