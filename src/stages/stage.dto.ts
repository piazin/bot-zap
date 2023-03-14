import { Message, Whatsapp } from 'venom-bot';

export interface IStageParameters {
  to: string;
  client: Whatsapp;
  message?: Message & {
    listResponse?: {
      title: string;
      description: string;
      singleSelectReply?: {
        selectedRowId?: string;
      };
    };
  };
}
