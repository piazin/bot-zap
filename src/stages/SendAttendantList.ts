import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantList } from '../constants/attendantList';
import { downloadFileService } from '../services/downloadFile.service';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';

export class SendAttendantList {
  private readonly storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    try {
      if (message.isMedia || message.isMMS) {
        storage[to].pathSuportImg = await downloadFileService.execute(client, message);
      }

      await client.sendText(to, attendantList);

      this.storageService.setStage(4);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      return invalidOption.execute({ to, client });
    }
  }
}
