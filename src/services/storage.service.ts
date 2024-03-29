import { storage } from '../storage';
import { IStorage } from '../storage';

export class StorageService {
  private readonly to: string;
  private readonly storage: Record<string, IStorage>;

  constructor(to: string, storage: Record<string, IStorage>) {
    this.to = to;
    this.storage = storage;
  }

  private getUserStorage(): IStorage {
    if (!storage[this.to]) {
      storage[this.to] = {
        stage: 0,
      };
    }
    return storage[this.to];
  }

  getStage(): number {
    return this.getUserStorage().stage;
  }

  setStage(stage: number): void {
    this.getUserStorage().stage = stage;
  }

  getTicket(): boolean {
    return this.getUserStorage().isTicket;
  }

  setTicket(trueOrFalse: boolean): void {
    this.getUserStorage().isTicket = trueOrFalse;
  }

  getProblemOrRequestMessage(): string {
    return this.getUserStorage().problemOrRequestMessage;
  }

  setProblemOrRequestMessage(message: string): void {
    this.getUserStorage().problemOrRequestMessage = message;
  }

  setPathSuportImg(path: string | null): void {
    this.getUserStorage().pathSuportImg = path;
  }

  getPathSuportImg(): string {
    return this.getUserStorage().pathSuportImg;
  }

  getUserEmail(): string {
    return this.getUserStorage().userEmail;
  }

  setUserEmail(email: string): void {
    this.getUserStorage().userEmail = email;
  }

  clear(): void {
    storage[this.to] = { stage: 0 };
  }
}
