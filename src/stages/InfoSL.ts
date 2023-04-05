import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { FileService } from '../services/file.service';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { OpenIaService } from '../services/openIa.service';
import { SpeechToText } from '../apis/SpeechToText';

let history = [];
let firstMessage = true;

export class InfoSL {
  private readonly storageService: StorageService;
  private readonly openIaService: OpenIaService;
  private readonly speechToText: SpeechToText;
  private fileService: FileService;
  private readonly MAX_IDLE_TIME_MS = 600000;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.openIaService = new OpenIaService();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void> {
    this.fileService = new FileService(client, message);
    try {
      client.startTyping(to);

      let userMessage = message.body;

      if (userMessage === '#sair') {
        const farewellMessage = `Foi um prazer ajudá-lo(a), ${message.sender.pushname} 🤝. Se tiver mais alguma dúvida, não hesite em entrar em contato. Obrigado!`;
        await client.sendText(to, farewellMessage);
        this.storageService.setStage(0);
        return;
      }

      if (message.mimetype === 'audio/ogg; codecs=opus') {
        const audioPath = await this.fileService.downloadFile();
        const audioText = await this.speechToText.execute(audioPath);
        await this.fileService.deleteFile(audioPath);
        userMessage = audioText;
      }

      const questionForTheChat = `
        Baseada na pergunta a cima deste usuário:
        ${userMessage}

        Devolva a informação que o usuário deseja saber, baseando se no texto a baixo:

       A SL é um dos maiores processadores de grãos integrais da América Latina e líder no segmento de aveia no Brasil.
       A SL Alimentos Ltda produz e fornece ingredientes e produtos finais para a indústria alimentícia baseados em cereais de inverno.

      Endereço: Rodovia do Café, Br 376, Km 289 S/n - Jd Industrial, Mauá da Serra - PR, 86828-000

      Telefone: (43) 2101-2550

      Fundador:
      Luiz Meneghel Neto, fundador e presidente da SL Alimentos, conta que o objetivo inicial da empresa era criar uma alternativa aos produtores para a cultura de trigo, em função de doenças que atingiam as lavouras da região.
      CEO:
      Roberta Meneghel, Com Graduação em Administração de Empresas no INSPER, MBA em Agronegócio na ESALQ-USP, meu desafio atual está na Harvard Business School no programa Owner President Management.

      Em atividade desde 1988 na cidade de Mauá da Serra, PR, a empresa surgiu com o principal intuito de produzir cereais de inverno para alimentação animal. Entretanto, desde 1997, sua expansão permitiu a produção para alimentação humana com dois focos de ação:
      - Desenvolver, produzir e fornecer ingredientes integrais e funcionais para clientes da Indústria Alimentícia e Animal;

      Toda a produção da indústria é automatizada e as técnicas de Lean Manufacturing estão implantadas em todas as suas linhas produtivas.
      Dentre as linhas específicas de produção do moinho, estão: descascamento, laminação, flocagem, moagem e micromoagem de farinhas e extrusão de crispies e farinhas modificadas.

       O logo da SL Alimentos se encontra neste link: 
       https://drive.google.com/drive/folders/1jWVeDRZiyyXaIyMVB_qqoahu3kvKIx8n

       Video institucional se encontra neste link: 
       https://drive.google.com/file/d/1-uVVg6OexKoUJxioUS7n7aAcR9hEsRP2/view

       Video comercial se encontra neste link: 
       https://drive.google.com/drive/folders/14isnkvyCY51zJQocFpO-lDdB7E7wgciK

       Manifesto SL se encontra neste link: 
       http://www.slpart.com.br/manifesto/Manifesto_com_Proposito.pdf

       Site da SL se encontra neste link:
       http://www.slalimentos.com.br/

       Instagram da SL alimentos se encontra neste link:
       https://www.instagram.com/sl.oficial/

       Linkedin da SL se encontra neste link:
       https://www.linkedin.com/company/slcereaisealimentos/
      `;

      if (firstMessage) {
        history.push(`${questionForTheChat}`);
        firstMessage = false;
      } else {
        history.push(`${userMessage}`);
      }

      const requestedInformation = await this.openIaService.createCompletion(
        history.join('\n\n\n\n')
      );

      history.push(`${requestedInformation}`);

      await client.sendText(to, requestedInformation.replace(/\s\s\s\s+/g, ''));

      const idleTimeout = setTimeout(() => {
        this.storageService.setStage(0);
      }, this.MAX_IDLE_TIME_MS);

      idleTimeout.refresh();
    } catch (error) {
      console.log('🚀 ~ file: InfoSL.ts:112 ~ InfoSL ~ execute ~ error:', error);
      this.storageService.setStage(0);
      return invalidOption.execute({ to, client });
    } finally {
      client.stopTyping(to);
    }
  }
}
