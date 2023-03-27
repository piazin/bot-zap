import path from 'path';
import { IStageParameters } from './stage.dto';
import { OpenIaService } from '../services/openIa.service';
import { downloadImage } from '../utils/downloadImage';
import { deleteImage } from '../utils/deleteImage';
import { StorageService } from '../services/storage.service';

export class GenerateImageByGPT3 {
  private readonly storageService: StorageService;
  private readonly MAX_IDLE_TIME_MS: number = 600000;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({ to, client, message }: IStageParameters): Promise<void> {
    try {
      if (message.body === '#sair') {
        const farewellMessage = `Foi um prazer ajudá-lo(a), ${message.sender.pushname} 🤝. Se tiver mais alguma dúvida, não hesite em entrar em contato. Obrigado!`;
        client.sendText(to, farewellMessage);
        this.storageService.setStage(0);
        return;
      }

      await client.startTyping(to);
      const url = await new OpenIaService().createImage(message.body);

      const pathImage = await downloadImage(url);
      await client.sendImage(to, path.resolve(pathImage));
      deleteImage(pathImage);

      const idleTime = setTimeout(() => {
        this.storageService.setStage(0);
      }, this.MAX_IDLE_TIME_MS);

      idleTime.refresh();
    } catch (error) {
      console.error(
        '🚀 ~ file: GenerateImageByGPT3.ts:30 ~ GenerateImageByGPT3 ~ execute ~ error:',
        error
      );
      await client.sendText(to, 'Ops! Não foi possivel gerar está imagem :(');
    } finally {
      await client.stopTyping(to);
    }
  }
}
