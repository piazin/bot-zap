import { IStageParameters } from './stage.dto';

class InvalidOption {
  execute({ to, client }: IStageParameters) {
    client.sendText(to, 'Por favor, envie uma opção valida.');
  }
}

export const invalidOption = new InvalidOption();
