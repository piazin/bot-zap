import { storage } from '../storage';

type RequestStage = {
  from: string;
};

export class StageService {
  getStage({ from }: RequestStage): number {
    if (storage[from]) {
      return storage[from].stage;
    } else {
      storage[from] = {
        user: from,
        stage: 0,
      };
    }

    return storage[from].stage;
  }
}
