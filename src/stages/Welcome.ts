import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { firstOptions } from '../constants/firstOptions';
import { StorageService } from '../services/storage.service';

export class Welcome {
  private storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    this.storageService = new StorageService(to);

    try {
      await client.sendText(
        to,
        `Olá ${message.sender.pushname}, \nEu sou o Cib, o assistente virtual do T.I SL.\nEstou aqui para ajudá-lo`
      );

      await client.sendListMenu(
        to,
        'Por favor, escolha uma das opções abaixo para que eu possa auxiliá-lo da melhor maneira possível',
        '',
        'selecionar',
        firstOptions
      );

      this.storageService.setStage(1);
    } catch (error) {
      console.error('🚀 ~ file: Welcome.ts:28 ~ Welcome ~ error:', error);
      await invalidOption.execute({ to, client });
    }
  }
}
