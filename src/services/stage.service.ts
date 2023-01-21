import { storage } from '../storage';

type RequestStage = {
  to: string;
};

export class StageService {
  getStage({ to }: RequestStage): number {
    if (storage[to]) {
      return storage[to].stage;
    } else {
      storage[to] = {
        user: to,
        stage: 0,
      };
    }

    return storage[to].stage;
  }
}
