import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { SpeechToText } from '../apis/SpeechToText';
import { FileService } from '../services/file.service';
import { StorageService } from '../services/storage.service';
import { ResponseService } from '../services/response.service';

export class ReceiveImageWithTheProblem {
  private fileService: FileService;
  private readonly speechToText: SpeechToText;
  private readonly storageService: StorageService;
  private readonly responseService: ResponseService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.speechToText = new SpeechToText();
    this.responseService = new ResponseService();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void> {
    this.fileService = new FileService(client, message);

    try {
      const replyMessage = this.responseService.getRandomAnswer('receiveImageWithTheProblem');

      if (message.caption) {
        client.sendText(
          to,
          'Notei que você já enviou uma imagem. Se você quiser mantê-la, digite "sim". Se quiser enviar uma imagem diferente, envia-a, lembre-se de enviar apenas uma imagem'
        );
      } else {
        client.sendText(to, replyMessage);
      }

      let problemMessage = message.body;
      if (message.mimetype === 'audio/ogg; codecs=opus')
        problemMessage = await this.convertSpeechToText();

      if (message.caption) problemMessage = message.caption;

      this.storageService.setProblemOrRequestMessage(problemMessage);

      if (message.isMedia || message.isMMS) {
        var path = await this.fileService.downloadFile();
        this.storageService.setPathSuportImg(path);
      }

      var stage = this.storageService.getTicket() ? 5 : 3;
      this.storageService.setStage(stage);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      await invalidOption.execute({ to, client });
    }
  }

  private async convertSpeechToText(): Promise<string> {
    const audioPath = await this.fileService.downloadFile();
    const audioText = await this.speechToText.execute(audioPath);
    await this.fileService.deleteFile(audioPath);
    return audioText;
  }
}
