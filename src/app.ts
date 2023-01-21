import { create, Whatsapp, Message } from 'venom-bot';
import { stages } from './stages';
import { StageService } from './services/stage.service';

const { getStage } = new StageService();
var messageResponse: any;

create('suport-test')
  .then((client) => start(client))
  .catch((err) => console.error('🚀 ~ file: app.ts:6 ~ err', err));

function start(client: Whatsapp): void {
  client.onMessage((message: Message) => {
    const from = message.from;
    const stage = getStage({ from });

    if (stage === 2) {
      messageResponse = stages[stage].stage.execute({
        from,
        client,
        message,
      });
      console.log(
        '🚀 ~ file: app.ts:29 ~ client.onMessage ~ messageResponse',
        messageResponse
      );
      return;
    }

    console.log(
      '🚀 ~ file: app.ts:29 ~ client.onMessage ~ messageResponse',
      messageResponse
    );

    stages[stage].stage.execute({ from, client, message, messageResponse });
  });
}
