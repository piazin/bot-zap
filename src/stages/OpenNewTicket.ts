import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { sendEmailService } from '../services/send_email.service';
import { OpenIaService } from '../services/open_ia.service';
import { deleteImage } from '../utils/deleteImage';

class OpenNewTicket {
  async execute({
    to,
    client,
    message,
    messageResponse,
  }: IStageParameters): Promise<void | string> {
    storage[to].userEmail = message.body;
    var subject: string = '';

    client.sendText(to, 'Estamos abrindo seu chamado... Aguarde um momento.');

    const requestOrIncident = await new OpenIaService().createCompletion(
      `isto é uma requisição ou incidente? \n ${messageResponse}`
    );

    if (requestOrIncident) {
      const matchLetter: RegExpMatchArray | null = requestOrIncident?.match(
        /\b(incidente|requisição)\b/g
      );

      if (matchLetter) {
        subject =
          (matchLetter[0] as string) === 'requisição'
            ? 'requisicao'
            : 'incidente';
      }
    }

    await sendEmailService.execute({
      to:
        process.env.NODE_ENV == 'production'
          ? 'ti@slpart.com.br'
          : storage[to].userEmail,
      cc: storage[to].userEmail,
      subject: subject || '',
      user_name: message.sender.pushname,
      content: messageResponse,
      attachment: storage[to].pathSuportImg ? storage[to].pathSuportImg : null,
    });

    if (process.env.NODE_ENV === 'production') {
      await sendEmailService.execute({
        to: 'suporte@slpart.com.br',
        subject: subject || '',
        user_name: message.sender.pushname,
        content: messageResponse,
        attachment: storage[to].pathSuportImg
          ? storage[to].pathSuportImg
          : null,
      });
    }

    client.sendText(
      to,
      'Chamado aberto com sucesso! Em breve você recebera atualizações do seu chamado, obrigado.'
    );

    if (storage[to].pathSuportImg) deleteImage(storage[to].pathSuportImg);

    storage[to].stage = 0;
    storage[to].isTicket = false;
    storage[to].pathSuportImg = null;
  }
}

export const openNewTicket = new OpenNewTicket();
