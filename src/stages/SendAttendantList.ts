import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { attendantList } from '../constants/attendantList';
import { FileService } from '../services/file.service';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { OpenIaService } from '../services/openIa.service';

export class SendAttendantList {
  private readonly storageService: StorageService;
  private readonly openIaService: OpenIaService;
  private fileService: FileService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.openIaService = new OpenIaService();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void | string> {
    this.fileService = new FileService(client, message);
    try {
      if (message.isMedia || message.isMMS) {
        storage[to].pathSuportImg = await this.fileService.downloadFile();
      }

      const problemOrRequestMessage = this.storageService.getProblemOrRequestMessage();

      const recommendedAttendant = await this.openIaService.createCompletion(`
        Baseada nesta mensagem do usuário: 
        ${problemOrRequestMessage}

        Qual desses atendentes melhor se encaixa para atender este chamado?

        Andrey - Manutenção de computadores, notebooks, celulares, problemas em softwares, problemas com excel, google, drive, emails, solicitações de compras, aquisição de novos equipamentos

        Sergio - Atende todos os chamados relacionados ao SE Suite e Senior

        Hernando - Atende todos os chamados relacionados ao SAP e Frontline

        Me devolva uma mensagem igual a está: 

        Recomendo falar com o atendente {nome atendente}
        .
      `);

      await client.sendText(to, recommendedAttendant.replace(/\s\s+/g, ''));
      await client.sendText(to, attendantList);

      this.storageService.setStage(4);
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      return invalidOption.execute({ to, client });
    }
  }
}
