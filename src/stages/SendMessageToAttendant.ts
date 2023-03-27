import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { attendantsPhoneNumber } from '../constants/attendantList';

export class SendMessageToAttendant {
  private readonly storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
  }

  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<void | string> {
    try {
      if (!message?.listResponse) return invalidOption.execute({ to, client });

      const attendantRequest = message.body;

      let thisAttendantExist = attendantsPhoneNumber.find(
        (attendant) => attendant.name === attendantRequest
      );

      if (!thisAttendantExist) {
        invalidOption.execute({ to, client });
        return;
      }

      var problemOrRequestMessage =
        this.storageService.getProblemOrRequestMessage();
      var pathSuportImg = this.storageService.getPathSuportImg();

      await Promise.all([
        client.sendText(
          thisAttendantExist.number,
          `Olá ${thisAttendantExist.name},\n\nUsuário(a): ${message.notifyName} te enviou um novo chamado, com o seguinte problema: \n\n ${problemOrRequestMessage}`
        ),
        pathSuportImg &&
          client.sendImage(
            thisAttendantExist.number,
            pathSuportImg,
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

      this.storageService.setStage(0);
      this.storageService.setPathSuportImg(null);
    } catch (error) {
      console.error(
        '🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:',
        error
      );
      return invalidOption.execute({ to, client });
    }
  }
}
