import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { downloadingImg } from '../services/downloadImg.service';

const ACCEPTED_MIME_TYPES = ['image/jpeg', undefined];

export class RequestUserEmail {
  private storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<string | void> {
    try {
      if (!ACCEPTED_MIME_TYPES.includes(message.mimetype)) {
        await invalidOption.execute({ to, client });
        return;
      }

      if (message.isMedia || message.isMMS) {
        var path = await downloadingImg.execute(client, message);
        this.storageService.setPathSuportImg(path);
      }

      await client.sendText(
        to,
        'Por favor, poderia me informar seu endereço de e-mail?'
      );
      this.storageService.setStage(6);
    } catch (error) {
      console.error(`Error in RequestUserEmail.execute: ${error}`);
      await invalidOption.execute({ to, client });
    }
  }
}
