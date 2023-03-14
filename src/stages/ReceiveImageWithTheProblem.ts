import { StorageService } from '../services/storage.service';
import { invalidOption } from './invalidOption';
import { IStageParameters } from './stage.dto';

export class ReceiveImageWithTheProblem {
  private storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({ to, client, message }: IStageParameters): Promise<void> {
    try {
      client.sendText(
        to,
        'Você gostaria de enviar alguma imagem do problema? Se sim, por favor, envie apenas uma imagem. Caso contrário, digite "não".'
      );

      this.storageService.setProblemOrRequestMessage(message.body);

      var stage = this.storageService.getTicket() ? 5 : 3;
      this.storageService.setStage(stage);
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      await invalidOption.execute({ to, client });
    }
  }
}
