import fs from 'fs';
import mime from 'mime-types';
import { storage } from '../storage';
import { IStageParameters } from './stage.dto';
import { Message, Whatsapp } from 'venom-bot';

class DownloadingImage {
  async execute({
    to,
    client,
    message,
  }: IStageParameters): Promise<string | void> {
    console.log(message);
    storage[to].stage = 4;
  }
}

export const downloadingImage = new DownloadingImage();
