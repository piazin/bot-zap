import {
  Welcome,
  TalkOrNewCall,
  SendAttendantList,
  ReceiveImageWithTheProblem,
  SendMessageToAttendant,
  RequestUserEmail,
  OpenNewTicket,
  ChatWithGPT3,
  GenerateImageByGPT3,
} from './stages/_index';

interface IStage {
  description: string;
  stage: any;
}

export const stages: IStage[] = [
  {
    description: 'Welcome to User',
    stage: Welcome,
  },
  {
    description: 'Talk to an attendant',
    stage: TalkOrNewCall,
  },
  {
    description: 'Send Image or No',
    stage: ReceiveImageWithTheProblem,
  },
  {
    description: 'Select Attendant',
    stage: SendAttendantList,
  },
  {
    description: 'Send Message to Attendant',
    stage: SendMessageToAttendant,
  },
  {
    description: 'Request User Email',
    stage: RequestUserEmail,
  },
  {
    description: 'Open New Ticket',
    stage: OpenNewTicket,
  },
  {
    description: 'Chat with GPT3',
    stage: ChatWithGPT3,
  },
  {
    description: 'Generate image by IA',
    stage: GenerateImageByGPT3,
  },
];
