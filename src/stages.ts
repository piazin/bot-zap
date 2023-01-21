import {
  welcome,
  talkOrNewCall,
  sendAttendantList,
  receiveImageWithTheProblem,
  sendMessageToAttendant,
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
];
