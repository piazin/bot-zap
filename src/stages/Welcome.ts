import { IStageParameters } from './stage.dto';
import { storage } from '../storage';
import { firstOptions } from '../constants/firstOptions';
import { invalidOption } from './invalidOption';

class Welcome {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    try {
      await client.sendText(
        to,
        `Olá ${message.sender.pushname}, \nMe chamo Cib, sou o assistente virtual do T.I SL.\nComo posso te ajudar?`
      );

      await client.sendListMenu(
        to,
        'Por favor, selecione uma das opções.',
        '',
        'selecionar',
        firstOptions
      );
      storage[to].stage = 1;
    } catch (error) {
      console.error('🚀 ~ file: Welcome.ts:28 ~ Welcome ~ error:', error);
      return invalidOption.execute({ to, client });
    }
  }
}

export const welcome = new Welcome();
