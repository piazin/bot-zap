import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { FileService } from '../services/file.service';
import { storage } from '../storage';

const ACCEPTED_MIME_TYPES = ['image/jpeg', undefined, 'audio/ogg; codecs=opus'];

export class RequestUserEmail {
  private storageService: StorageService;
  private fileService: FileService;

  constructor(to: string) {
    this.storageService = new StorageService(to, storage);
  }

  async execute({ to, client, message }: IStageParameters): Promise<string | void> {
    try {
      await client.startTyping(to);
      this.fileService = new FileService(client, message);

      const { mimetype, isMMS, isMedia } = message;

      if (!ACCEPTED_MIME_TYPES.includes(mimetype)) {
        await invalidOption.execute({ to, client });
        return;
      }

      if (isMedia || isMMS) {
        this.storageService.setPathSuportImg(await this.fileService.downloadFile());
      }

      await client.sendText(to, 'Por favor, poderia me informar seu endereço de e-mail?');
      this.storageService.setStage(6);
    } catch (error) {
      console.error(`Error in RequestUserEmail.execute: ${error}`);
      await invalidOption.execute({ to, client });
    } finally {
      await client.stopTyping(to);
    }
  }
}
