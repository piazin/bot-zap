import { SpeechToText } from '../apis/SpeechToText';
import { FileService } from '../services/file.service';
import { StorageService } from '../services/storage.service';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

export class ReceiveImageWithTheProblem {
  private fileService: FileService;
  private readonly storageService: StorageService;
  private readonly speechToText: SpeechToText;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.speechToText = new SpeechToText();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void> {
    this.fileService = new FileService(client, message);

    try {
      client.sendText(
        to,
        'Você gostaria de enviar alguma imagem do problema? Se sim, por favor, envie apenas uma imagem. Caso contrário, digite "não".'
      );

      let problemMessage = message.body;

      if (message.mimetype === 'audio/ogg; codecs=opus') {
        const audioPath = await this.fileService.downloadFile();
        const audioText = await this.speechToText.execute(audioPath);
        problemMessage = audioText;
      }

      this.storageService.setProblemOrRequestMessage(problemMessage);

      var stage = this.storageService.getTicket() ? 5 : 3;
      this.storageService.setStage(stage);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      await invalidOption.execute({ to, client });
    }
  }
}
