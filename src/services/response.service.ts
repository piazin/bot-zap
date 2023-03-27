import responses from '../constants/welcome';

type stageNames =
  | 'welcome'
  | 'talkAttendant'
  | 'sendImageOrNo'
  | 'selectAttendant'
  | 'sendMessageToAttendant';

export class ResponseService {
  private readonly responses: string[];
  private readonly stageName: stageNames;
  private readonly userName: string = undefined;

  constructor(stageName: stageNames, userName?: string) {
    this.userName = userName;
    this.stageName = stageName;
    this.responses = responses;
  }

  returnRandomAnswer() {
    if (this.stageName === 'welcome') {
      return this.userName
        ? this.generateRandomAnswerWithUserName()
        : this.generateRandomAnswer();
    }
  }

  private generateRandomNumber(): number {
    return Math.floor(Math.random() * this.responses.length + 1);
  }

  private generateRandomAnswer(): string {
    return this.responses[this.generateRandomNumber()];
  }

  private generateRandomAnswerWithUserName(): string {
    return this.responses[this.generateRandomNumber()].replace(
      '${user}',
      this.userName
    );
  }
}
