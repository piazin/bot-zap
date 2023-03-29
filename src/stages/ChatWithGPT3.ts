import { SpeechToText } from '../apis/SpeechToText';
import { FileService } from '../services/file.service';
import { OpenIaService } from '../services/openIa.service';
import { StorageService } from '../services/storage.service';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

export class ChatWithGPT3 {
  private fileService: FileService;
  private readonly speechToText: SpeechToText;
  private readonly storageService: StorageService;
  private static readonly MAX_IDLE_TIME_MS = 600000;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.speechToText = new SpeechToText();
  }

  async execute({ to, client, message }: IStageParameters) {
    this.fileService = new FileService(client, message);

    try {
      if (message.body === '#sair') {
        const farewellMessage = `Foi um prazer ajudá-lo(a), ${message.sender.pushname} 🤝. Se tiver mais alguma dúvida, não hesite em entrar em contato. Obrigado!`;
        await client.sendText(to, farewellMessage);
        this.storageService.setStage(0);
        return;
      }

      let userQuestion = message.body;

      client.startTyping(to);

      if (message.mimetype === 'audio/ogg; codecs=opus') {
        const audioPath = await this.fileService.downloadFile();
        const audioText = await this.speechToText.execute(audioPath);
        await this.fileService.deleteFile(audioPath);
        userQuestion = audioText;
      }

      const response = await new OpenIaService().createCompletion(userQuestion);
      await client.sendText(to, response);

      const idleTimeout = setTimeout(() => {
        this.storageService.setStage(0);
      }, ChatWithGPT3.MAX_IDLE_TIME_MS);

      idleTimeout.refresh();
    } catch (error) {
      console.error(`Error in ChatWithGPT3.execute: ${error}`);
      await invalidOption.execute({ to, client });
    } finally {
      await client.stopTyping(to);
    }
  }
}
