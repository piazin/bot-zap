import { Message, Whatsapp } from '@wppconnect-team/wppconnect';

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
