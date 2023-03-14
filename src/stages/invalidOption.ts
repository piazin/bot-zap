import { IStageParameters } from './stage.dto';

class InvalidOption {
  async execute({ to, client }: IStageParameters) {
    await client.sendText(to, 'Por favor, envie uma opção valida.');
  }
}

export const invalidOption = new InvalidOption();
