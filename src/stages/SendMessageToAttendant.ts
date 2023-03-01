import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantsPhoneNumber } from '../constants/attendantList';
import { invalidOption } from './invalidOption';

class SendMessageToAttendant {
  async execute({
    to,
    client,
    message,
    messageResponse,
  }: IStageParameters): Promise<void | string> {
    if (!message?.listResponse) return invalidOption.execute({ to, client });

    const attendantRequest = message.listResponse.title;

    if (!message?.listResponse) {
      invalidOption.execute({ to, client });
      return;
    }

    let thisAttendantExist = attendantsPhoneNumber.find(
      (attendant) => attendant.name === attendantRequest
    );

    if (!thisAttendantExist) {
      invalidOption.execute({ to, client });
      return;
    }

    client.sendText(
      to,
      `Estou enviando o seu problema para o atendente ${attendantRequest}.`
    );

    client.sendText(
      thisAttendantExist.number,
      `Olá ${thisAttendantExist.name},\n\nUsuário(a): ${message.notifyName} te enviou um novo chamado, com o seguinte problema: \n\n ${messageResponse}`
    );

    if (storage[to]?.pathSuportImg) {
      await client.sendImage(
        thisAttendantExist.number,
        storage[to].pathSuportImg,
        'File suport'
      );
    }

    client.sendContactVcard(
      thisAttendantExist.number,
      message.from,
      message.notifyName
    );

    client.sendText(to, 'Tudo certo! Em breve o atendente entrara em contato');
    storage[to].stage = 0;
    storage[to].pathSuportImg = null;
  }
}

export const sendMessageToAttendant = new SendMessageToAttendant();
