import { Message, Whatsapp } from '@wppconnect-team/wppconnect';

export interface IStageParameters {
  to: string;
  client: Whatsapp;
  message?: Message & {
    caption: string;
  };
}
