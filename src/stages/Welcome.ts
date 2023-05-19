import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { firstOptions } from '../constants/firstOptions';
import { StorageService } from '../services/storage.service';
import { ResponseService } from '../services/response.service';
import { FileService } from '../services/file.service';
import { SpeechToText } from '../apis/SpeechToText';
import { storage } from '../storage';

export class Welcome {
  private fileService: FileService;
  private responseService: ResponseService;
  private readonly speechToText: SpeechToText;
  private readonly storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to, storage);
    this.speechToText = new SpeechToText();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    this.responseService = new ResponseService(message.sender.pushname);
    this.fileService = new FileService(client, message);

    try {
      await client.startTyping(to);

      let { body: userMessage, mimetype } = message;

      if (mimetype === 'audio/ogg; codecs=opus') {
        userMessage = await this.convertSpeechToText();
      }

      const replyMessage = await this.responseService.getRandomAnswerByGpt('welcome', userMessage);
      await client.sendText(to, replyMessage.replace(/\s\s+/g, ''));

      await client.sendText(to, firstOptions);

      this.storageService.setStage(1);
    } catch (error) {
      console.error('🚀 ~ file: Welcome.ts:28 ~ Welcome ~ error:', error);
      await invalidOption.execute({ to, client });
    } finally {
      await client.stopTyping(to);
    }
  }

  private async convertSpeechToText(): Promise<string> {
    const audioPath = await this.fileService.downloadFile();
    const audioText = await this.speechToText.execute(audioPath);
    await this.fileService.deleteFile(audioPath);

    return audioText;
  }
}
