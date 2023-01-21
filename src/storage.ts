interface IStorage {
  stage: number;
  user: string;
  pathSuportImg?: string;
  allStagesCompleted?: boolean;
}

export var storage: IStorage = Object.create({});
