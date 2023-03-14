import { OpenIaService } from '../services/openIa.service';
import { StorageService } from '../services/storage.service';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

export class ChatWithGPT3 {
  private readonly storageService: StorageService;
  private static readonly MAX_IDLE_TIME_MS = 600000;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({ to, client, message }: IStageParameters) {
    try {
      if (message.body === '#sair') {
        const farewellMessage = `Foi um prazer atendê-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma dúvida pode sempre me procurar! Obrigado.`;
        await client.sendText(to, farewellMessage);
        this.storageService.setStage(0);
        return;
      }

      client.startTyping(to);
      const response = await new OpenIaService().createCompletion(message.body);
      await client.sendText(to, response);
      await client.stopTyping(to);

      const idleTimeout = setTimeout(() => {
        this.storageService.setStage(0);
      }, ChatWithGPT3.MAX_IDLE_TIME_MS);

      idleTimeout.refresh();
    } catch (error) {
      console.error(`Error in ChatWithGPT3.execute: ${error}`);
      await invalidOption.execute({ to, client });
    }
  }
}
