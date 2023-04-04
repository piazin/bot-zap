import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { FileService } from '../services/file.service';
import { invalidOption } from './invalidOption';
import { StorageService } from '../services/storage.service';
import { OpenIaService } from '../services/openIa.service';

export class InfoSL {
  private readonly storageService: StorageService;
  private readonly openIaService: OpenIaService;
  private fileService: FileService;

  constructor(to: string) {
    this.storageService = new StorageService(to);
    this.openIaService = new OpenIaService();
  }

  async execute({ to, client, message }: IStageParameters): Promise<void> {
    this.fileService = new FileService(client, message);
    try {
      if (message.body === '#sair') {
        const farewellMessage = `Foi um prazer ajudá-lo(a), ${message.sender.pushname} 🤝. Se tiver mais alguma dúvida, não hesite em entrar em contato. Obrigado!`;
        await client.sendText(to, farewellMessage);
        this.storageService.setStage(0);
        return;
      }

      const questionForTheChat = `
        Baseada na pergunta deste usuário:

        ${message.body}

        Devolva a informação que o usuário deseja saber, baseando se no texto a baixo:


       A SL é um dos maiores processadores de grãos integrais da América Latina e líder no segmento de aveia no Brasil.

       A SL Alimentos Ltda produz e fornece ingredientes e produtos finais para a indústria alimentícia baseados em cereais de inverno.

      Em atividade desde 1988 na cidade de Mauá da Serra, PR, a empresa surgiu com o principal intuito de produzir cereais de inverno para alimentação animal. Entretanto, desde 1997, sua expansão permitiu a produção para alimentação humana com dois focos de ação:


      - Desenvolver, produzir e fornecer ingredientes integrais e funcionais para clientes da Indústria Alimentícia e Animal;


      - Fabricar e envasar produtos alimentícios finais com a marca de seus clientes em contratos de co-manufacturing e co-packing.

      Localizado em Mauá da Serra, a indústria da SL Alimentos incorpora equipamentos e técnicas dentro do Estado da Arte em operações de armazenagem de grãos, produção de farinhas, flocos, mesclas e extrusados.

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

      const requestedInformation = await this.openIaService.createCompletion(questionForTheChat);

      await client.sendText(to, requestedInformation.replace(/\s\s+/g, ''));
    } catch (error) {
      console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
      return invalidOption.execute({ to, client });
    }
  }
}
