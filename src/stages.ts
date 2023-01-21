import { stageZero, stageOne, stageTwo, stageThree } from './stages/index';

export const stages = [
  {
    description: 'Welcome to User',
    stage: stageZero,
  },
  {
    description: 'Talk to an attendant',
    stage: stageOne,
  },
  {
    description: 'Problem description',
    stage: stageTwo,
  },
  {
    description: 'Select attendant',
    stage: stageThree,
  },
];
