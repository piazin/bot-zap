import { storage } from '../storage';

export class StageService {
  getStage({ to }: { to: string }): number {
    if (!storage[to]) {
      storage[to] = {
        userEmail: to,
        stage: 0,
      };
      return;
    }

    return storage[to].stage;
  }
}
