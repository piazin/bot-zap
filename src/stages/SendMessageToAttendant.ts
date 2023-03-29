import { IStageParameters } from './stage.dto';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { attendantsPhoneNumber } from '../constants/attendantList';
import { SpeechToText } from '../apis/SpeechToText';
import { FileService } from '../services/file.service';
import { OpenIaService } from '../services/openIa.service';

export class SendMessageToAttendant {
  private fileService: FileService;
  private readonly speechToText: SpeechToText;
  private readonly openIaService: OpenIaService;
  private readonly storageService: StorageService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.speechToText = new SpeechToText();
    this.openIaService = new OpenIaService();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    this.fileService = new FileService(client, message);

    try {
      let attendantRequest = message.body;

      if (message.mimetype === 'audio/ogg; codecs=opus') {
        const audioPath = await this.fileService.downloadFile();
        const audioText = await this.speechToText.execute(audioPath);
        await this.fileService.deleteFile(audioPath);
        attendantRequest = audioText;
      }

      const response = await this.openIaService
        .createCompletion(`Baseado neste texto \n\n ${attendantRequest} com qual desses atendentes o usuário deseja? \n\n 1 - Lucas (Suporte de Infraestrutura) \n
      \n 2 - Sergio (Suporte de Sistemas Senior/SE Suite)
      \n 3 - Hernando (Suporte de Sistemas SAP/Frontline) \n\n Caso encontre uma opção parecida responda apenas com o numero da opção, caso não ache nenhuma opção parecida retorne apenas 0`);

      const attendantId = response.replace(/[^0-9]/g, '');

      let thisAttendantExist = attendantsPhoneNumber.find((attendant) => attendant.id === attendantId);

      if (!thisAttendantExist) {
        invalidOption.execute({ to, client });
        return;
      }

      var problemOrRequestMessage = this.storageService.getProblemOrRequestMessage();
      var pathSuportImg = this.storageService.getPathSuportImg();

      await Promise.all([
        client.sendText(
          thisAttendantExist.number,
          `Olá ${thisAttendantExist.name},\n\nUsuário(a): ${message.notifyName} te enviou um novo chamado, com o seguinte problema: \n\n ${problemOrRequestMessage}`
        ),
        pathSuportImg && client.sendImage(thisAttendantExist.number, pathSuportImg, 'File suport'),
        client.sendContactVcard(thisAttendantExist.number, message.from, message.notifyName),
        client.sendText(to, 'Tudo certo! Em breve o atendente entrará em contato.'),
      ]);

      this.storageService.setStage(0);
      this.storageService.setPathSuportImg(null);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      return invalidOption.execute({ to, client });
    }
  }
}
