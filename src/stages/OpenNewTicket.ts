import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { sendEmailService } from '../services/send_email.service';

class OpenNewTicket {
  async execute({
    to,
    client,
    message,
    messageResponse,
  }: IStageParameters): Promise<void | string> {
    storage[to].userEmail = message.body;

    client.sendText(to, 'Estamos abrindo seu chamado... Aguarde um momento.');

    await sendEmailService.execute({
      to: storage[to].userEmail,
      content: messageResponse,
      attachment: storage[to].pathSuportImg ? storage[to].pathSuportImg : null,
    });

    client.sendText(
      to,
      'Chamado aberto com sucesso! Em breve você recebera atualizações do seu chamado, obrigado.'
    );

    storage[to].stage = 0;
    storage[to].isTicket = false;
  }
}

export const openNewTicket = new OpenNewTicket();
