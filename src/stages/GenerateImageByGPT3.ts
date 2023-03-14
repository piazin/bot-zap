import path from 'path';
import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { OpenIaService } from '../services/openIa.service';
import { downloadImage } from '../utils/downloadImage';
import { deleteImage } from '../utils/deleteImage';

class GenerateImageByGPT3 {
  async execute({ to, client, message }: IStageParameters): Promise<void> {
    try {
      if (message.body === '#sair') {
        client.sendText(
          to,
          `Foi um prazer atende-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma  dúvida pode sempre me procurar! Obrigado.`
        );
        storage[to].stage = 0;
        return;
      }

      await client.startTyping(to);
      const url = await new OpenIaService().createImage(message.body);

      const pathImage = await downloadImage(url);
      await client.sendImage(to, path.resolve(pathImage));
      deleteImage(pathImage);
      await client.stopTyping(to);

      setTimeout(() => {
        storage[to].stage = 0;
      }, 600000);
    } catch (error) {
      console.error(
        '🚀 ~ file: GenerateImageByGPT3.ts:30 ~ GenerateImageByGPT3 ~ execute ~ error:',
        error
      );
      await client.sendText(to, 'Ops! Não foi possivel gerar está imagem :(');
    }
  }
}

export const generateImageByGPT3 = new GenerateImageByGPT3();
