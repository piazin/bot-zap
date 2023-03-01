import {
  welcome,
  talkOrNewCall,
  sendAttendantList,
  receiveImageWithTheProblem,
  sendMessageToAttendant,
  requestUserEmail,
  openNewTicket,
  chatWithGPT3,
  generateImageByGPT3,
} from './stages/_index';

export const stages = [
  {
    description: 'Welcome to User',
    stage: welcome,
  },
  {
    description: 'Talk to an attendant',
    stage: talkOrNewCall,
  },
  {
    description: 'Send Image or No',
    stage: receiveImageWithTheProblem,
  },
  {
    description: 'Select Attendant',
    stage: sendAttendantList,
  },
  {
    description: 'Send Message to Attendant',
    stage: sendMessageToAttendant,
  },
  {
    description: 'Request User Email',
    stage: requestUserEmail,
  },
  {
    description: 'Open New Ticket',
    stage: openNewTicket,
  },
  {
    description: 'Chat with GPT3',
    stage: chatWithGPT3,
  },
  {
    description: 'Generate image by IA',
    stage: generateImageByGPT3,
  },
];
