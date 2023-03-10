import { create, Whatsapp, Message } from 'venom-bot';
import { stages } from './stages';
import { StageService } from './services/stage.service';
import { config } from 'dotenv';

config();

const { getStage } = new StageService();

create('suport-t.i-sl')
  .then((client) => start(client))
  .catch((err) => console.error('🚀 ~ file: app.ts:6 ~ err', err));

function start(client: Whatsapp): void {
  client.onMessage((message: Message) => {
    if (message.isGroupMsg) return;

    const to = message.from;
    var stage = getStage({ to });

    stages[stage].stage.execute({ to, client, message });
  });
}
