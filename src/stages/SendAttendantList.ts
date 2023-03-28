import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantList } from '../constants/attendantList';
import { FileService } from '../services/file.service';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';

export class SendAttendantList {
  private readonly storageService: StorageService;
  private fileService: FileService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    try {
      this.fileService = new FileService(client, message);

      if (message.isMedia || message.isMMS) {
        storage[to].pathSuportImg = await this.fileService.downloadFile();
      }

      await client.sendText(to, attendantList);

      this.storageService.setStage(4);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      return invalidOption.execute({ to, client });
    }
  }
}
