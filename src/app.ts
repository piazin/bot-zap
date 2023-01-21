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
    if (message.isGroupMsg) return;

    const to = message.from;
    var stage = getStage({ to });

    if (stage === 2 || stage === 5) {
      messageResponse = stages[stage].stage.execute({
        to,
        client,
        message,
      });
      return;
    }

    stages[stage].stage.execute({ to, client, message, messageResponse });
  });
}
