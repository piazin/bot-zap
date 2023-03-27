import { IStageParameters } from './stage.dto';

const responses = [
  'Por gentileza, escolha uma alternativa válida.',
  'Desculpe, mas a opção que você escolheu não é válida. Por favor, selecione uma opção diferente',
  'Certifique-se de selecionar uma opção válida antes de prosseguir',
  'Infelizmente, a opção que você escolheu não é válida. Por favor, escolha uma opção que esteja dentro dos critérios necessários',
  'Por favor, selecione uma opção que esteja de acordo com as instruções fornecidas.',
];

class InvalidOption {
  async execute({ to, client }: IStageParameters) {
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length + 1)];
    await client.sendText(to, randomResponse);
  }
}

export const invalidOption = new InvalidOption();
