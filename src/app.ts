import { config } from 'dotenv';
import { stages } from './stages';
import { StorageService } from './services/storage.service';
import { create, Whatsapp, Message } from '@wppconnect-team/wppconnect';

config();

create({ session: 'support-ti', disableWelcome: true })
  .then((client) => start(client))
  .catch((err) => console.error('🚀 ~ file: app.ts:6 ~ err', err));

function start(client: Whatsapp): void {
  client.onMessage(async (message: Message) => {
    if (message.isGroupMsg) return;

    const to = message.from;
    const storageService = new StorageService(to);
    var stage = storageService.getStage();
    var currentStage = stages[stage].stage;

    const stageInstance = new currentStage(to);
    //@ts-ignore
    stageInstance.execute({ to, client, message });
  });
}
