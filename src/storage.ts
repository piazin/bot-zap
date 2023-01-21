interface IStorage {
  stage: number;
  user: string;
}

export var storage: IStorage = Object.create({});
