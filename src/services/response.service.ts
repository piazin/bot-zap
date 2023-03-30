import responses from '../constants';
import { OpenIaService } from './openIa.service';

type stageNames =
  | 'welcome'
  | 'talkAttendant'
  | 'receiveImageWithTheProblem'
  | 'selectAttendant'
  | 'sendMessageToAttendant'
  | 'opennewticket';

export class ResponseService {
  private stageName: string;
  private responses: string[];
  private completationByGpt: string = '';
  private readonly openai: OpenIaService;
  private readonly userName: string = undefined;

  constructor(userName?: string) {
    this.userName = userName;
    this.openai = new OpenIaService();
  }

  getRandomAnswer(stageName: stageNames) {
    this.stageName = stageName;
    this.setResponsesByStage();
    return this.userName ? this.generateRandomAnswerWithUserName() : this.generateRandomAnswer();
  }

  async getRandomAnswerByGpt(stageName: stageNames, userMessage: string): Promise<string> {
    const completation = responses[stageName];
    this.completationByGpt = completation.replace('{userMessage}', userMessage);

    var response = (await this.openai.createCompletion(this.completationByGpt)).replace(
      '{user}',
      this.userName
    );

    return response;
  }

  private setResponsesByStage(): void {
    this.responses = responses[this.stageName];
  }

  private generateRandomNumber(): number {
    return Math.floor(Math.random() * this.responses.length || 0);
  }

  private generateRandomAnswer(): string {
    return this.responses[this.generateRandomNumber()];
  }

  private generateRandomAnswerWithUserName(): string {
    return this.responses[this.generateRandomNumber()].replace('${user}', this.userName);
  }
}
