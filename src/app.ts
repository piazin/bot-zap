import { create, Whatsapp, Message } from 'venom-bot';
import { stages } from './stages';
import { StorageService } from './services/storage.service';
import { config } from 'dotenv';

config();

create('suport-t.i-sl')
  .then((client) => start(client))
  .catch((err) => console.error('🚀 ~ file: app.ts:6 ~ err', err));

function start(client: Whatsapp): void {
  client.onMessage(async (message: Message) => {
    if (message.isGroupMsg) return;

    const to = message.from;

    const storageService = new StorageService(to);
    var stage = storageService.getStage();

    var currentStage = stages[stage].stage;

    //@ts-ignore
    await new currentStage(to).execute({ to, client, message });
  });
}
