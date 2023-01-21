import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantsPhoneNumber } from '../constants/attendantList';

class SendMessageToAttendant {
  execute({
    to,
    client,
    message,
    messageResponse,
  }: IStageParameters): void | string {
    const attendantRequest = message.listResponse.title;

    if (!message?.listResponse) {
      client.sendText(to, 'opção invalida');
      return;
    }

    let thisAttendantExist = attendantsPhoneNumber.find(
      (attendant) => attendant.name === attendantRequest
    );

    if (!thisAttendantExist) {
      client.sendText(to, 'opção invalida');
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

    client.sendContactVcard(
      thisAttendantExist.number,
      message.from,
      message.notifyName
    );
  }
}

export const sendMessageToAttendant = new SendMessageToAttendant();
