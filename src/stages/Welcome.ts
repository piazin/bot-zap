import { IStageParameters } from './stage.dto';
import { storage } from '../storage';
import { firstOptions } from '../constants/firstOptions';

class Welcome {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    // client.sendText(
    //   to,
    //   `Olá ${message.sender.pushname}, \n\nEu sou o Cib 🤖, seu assistente virtual do T.I SL.\nEm que posso ajudar?\n\n1 - Abrir um novo chamado \n2 - Falar com um de nossos atendentes \n3 - Fazer uma pergunta ao ChatGPT? \n4 - Gerar uma imagem a partir de uma IA`
    // );
    await client.sendText(
      to,
      `Olá ${message.sender.pushname}, \n\nEu sou o Cib, seu assistente virtual do T.I SL.\n\nEm que posso ajudar? 🤖\n`
    );

    await client.sendListMenu(
      to,
      'Por favor, selecione uma das opções.',
      '',
      'selecionar',
      firstOptions
    );
    storage[to].stage = 1;
  }
}

export const welcome = new Welcome();
