import { storage } from '../storage';
import { IStageParameters } from './stage.dto';

class TalkOrNewCall {
  execute({ to, client, message }: IStageParameters) {
    switch (message.body.replace(' ', '')) {
      case '1':
        console.log('send 1');
        break;
      case '2':
        client.sendText(
          to,
          'Faça uma breve descrição do problema que está enfretando...'
        );

        storage[to].stage = 2;
    }
  }
}

export const talkOrNewCall = new TalkOrNewCall();
