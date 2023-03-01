import { OpenIaService } from '../services/open_ia.service';
import { storage } from '../storage';
import { IStageParameters } from './stage.dto';

class ChatWithGPT3 {
  async execute({ to, client, message }: IStageParameters) {
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
    setTimeout(() => {
      storage[to].stage = 0;
    }, 600000);
  }
}

export const chatWithGPT3 = new ChatWithGPT3();
