interface IStorage {
  stage: number;
  userEmail: string;
  pathSuportImg?: string;
  allStagesCompleted?: boolean;
  isTicket?: boolean;
}

export var storage: IStorage = Object.create({});
