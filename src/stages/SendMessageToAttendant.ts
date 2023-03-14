import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantsPhoneNumber } from '../constants/attendantList';
import { invalidOption } from './invalidOption';

class SendMessageToAttendant {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    try {
      if (!message?.listResponse) return invalidOption.execute({ to, client });

      const attendantRequest = message.listResponse.title;

      let thisAttendantExist = attendantsPhoneNumber.find(
        (attendant) => attendant.name === attendantRequest
      );

      if (!thisAttendantExist) {
        invalidOption.execute({ to, client });
        return;
      }

      await Promise.all([
        client.sendText(
          thisAttendantExist.number,
          `Olá ${thisAttendantExist.name},\n\nUsuário(a): ${message.notifyName} te enviou um novo chamado, com o seguinte problema: \n\n ${storage[to].problemOrRequestMessage}`
        ),
        storage[to]?.pathSuportImg &&
          client.sendImage(
            thisAttendantExist.number,
            storage[to].pathSuportImg,
            'File suport'
          ),
        client.sendContactVcard(
          thisAttendantExist.number,
          message.from,
          message.notifyName
        ),
        client.sendText(
          to,
          'Tudo certo! Em breve o atendente entrará em contato.'
        ),
      ]);

      storage[to].stage = 0;
      storage[to].pathSuportImg = null;
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      return invalidOption.execute({ to, client });
    }
  }
}

export const sendMessageToAttendant = new SendMessageToAttendant();
