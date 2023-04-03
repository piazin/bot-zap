import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { SpeechToText } from '../apis/SpeechToText';
import { FileService } from '../services/file.service';

export class ConfirmEmail {
  private fileService: FileService;
  private readonly speechToText: SpeechToText;
  private readonly storageService: StorageService;

  constructor(private readonly to: string) {
    this.storageService = new StorageService(to);
    this.speechToText = new SpeechToText();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    this.fileService = new FileService(client, message);

    try {
      let userEmail = message.body;
      if (message.mimetype === 'audio/ogg; codecs=opus') {
        userEmail = await this.convertSpeechToText();
      }
      this.storageService.setUserEmail(userEmail);

      await client.sendText(to, `O e-mail ${userEmail}, está correto?`);

      this.storageService.setStage(7);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      return invalidOption.execute({ to, client });
    }
  }

  private async convertSpeechToText(): Promise<string> {
    const audioPath = await this.downloadAudio();
    const audioText = await this.speechToText.execute(audioPath);
    await this.fileService.deleteFile(audioPath);

    return audioText;
  }

  private async downloadAudio(): Promise<string> {
    const audioPath = await this.fileService.downloadFile();
    return audioPath;
  }
}