import { storage } from '../storage';
import { IStageParameters } from './stage.dto';

class StageOne {
  execute({ from, client, message }: IStageParameters) {
    switch (message.body.replace(' ', '')) {
      case '1':
        console.log('send 1');
        break;
      case '2':
        client.sendText(
          from,
          'Faça uma breve descrição do problema que está enfretando...'
        );

        storage[from].stage = 2;
    }
  }
}

export const stageOne = new StageOne();
