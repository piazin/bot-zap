import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { firstOptions } from '../constants/firstOptions';
import { StorageService } from '../services/storage.service';
import { ResponseService } from '../services/response.service';

export class Welcome {
  private responseService: ResponseService;
  private readonly storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    this.responseService = new ResponseService(message.sender.pushname);

    try {
      await client.sendText(to, this.responseService.getRandomAnswer('welcome'));

      await client.sendText(to, firstOptions);

      this.storageService.setStage(1);
    } catch (error) {
      console.error('🚀 ~ file: Welcome.ts:28 ~ Welcome ~ error:', error);
      await invalidOption.execute({ to, client });
    }
  }
}
