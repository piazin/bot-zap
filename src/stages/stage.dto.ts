import { Message, Whatsapp } from 'venom-bot';

interface IMessage extends Message {
  listResponse?: {
    title: string;
    description: string;
  };
}

export interface IStageParameters {
  to: string;
  client: Whatsapp;
  message?: IMessage;
  messageResponse?: string;
}
