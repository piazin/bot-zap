import { config } from 'dotenv';
import { stages } from './stages';
import { StorageService } from './services/storage.service';
import { create, Whatsapp, Message } from '@wppconnect-team/wppconnect';
import { storage } from './storage';

config();

const MAX_IDLE_TIME_MS = 6000000;

create({ session: 'support-ti', disableWelcome: true })
  .then((client) => start(client))
  .catch(handleError);

function start(client: Whatsapp): void {
  client.onMessage((message) => handleMessage(message, client));
}

async function handleMessage(message: Message, client: Whatsapp): Promise<void> {
  if (message.isGroupMsg) return;

  const to = message.from;
  const storageService = new StorageService(to, storage);
  const currenStageIndex = storageService.getStage();
  const currentStage = stages[currenStageIndex].stage;

  const stage = new currentStage(to);
  //@ts-ignore
  stage.execute({ to, client, message });

  let idleTimeout = setTimeout(() => storageService.clear(), MAX_IDLE_TIME_MS);

  idleTimeout.refresh();
}

function handleError(err: Error): void {
  console.error('🚀 ~ file: app.ts:6 ~ err', err);
}
