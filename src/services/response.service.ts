import responses from '../constants';

type stageNames =
  | 'welcome'
  | 'talkAttendant'
  | 'sendImageOrNo'
  | 'selectAttendant'
  | 'sendMessageToAttendant'
  | 'opennewticket';

export class ResponseService {
  private responses: string[];
  private stageName: string;
  private readonly userName: string = undefined;

  constructor(userName?: string) {
    this.userName = userName;
  }

  getRandomAnswer(stageName: stageNames) {
    this.setStage(stageName);
    this.setResponsesByStage();
    return this.userName ? this.generateRandomAnswerWithUserName() : this.generateRandomAnswer();
  }

  private setStage(stageName: stageNames): void {
    this.stageName = Object.keys(responses).find((res) => res === stageName);
  }

  private setResponsesByStage(): void {
    this.responses = responses[this.stageName];
  }

  private generateRandomNumber(): number {
    return Math.floor(Math.random() * this.responses.length);
  }

  private generateRandomAnswer(): string {
    return this.responses[this.generateRandomNumber()];
  }

  private generateRandomAnswerWithUserName(): string {
    return this.responses[this.generateRandomNumber()].replace('${user}', this.userName);
  }
}
