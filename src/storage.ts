interface IStorage {
  stage: number;
  userEmail: string;
  pathSuportImg?: string;
  problemOrRequestMessage?: string;
  isTicket?: boolean;
}

export var storage: Record<string, IStorage> = Object.create({});
