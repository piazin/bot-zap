import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';
import { Message, Whatsapp } from '@wppconnect-team/wppconnect';
import { convertToMp3 } from '../utils/convertAudioToMP3';

export class FileService {
  private client: Whatsapp;
  private mediaBody: Message;

  constructor(client: Whatsapp, messageBody: Message) {
    this.client = client;
    this.mediaBody = messageBody;
  }

  async downloadFile(): Promise<string> {
    try {
      const buffer = await this.client.decryptFile(this.mediaBody);
      var filePath = this.getPathFile();
      await fs.writeFile(filePath, buffer);

      if (this.mediaBody.mimetype === 'audio/ogg; codecs=opus') {
        var mp3FilePath = await this.downloadAudio(this.getFileName());
        await this.deleteFile(filePath);
        filePath = mp3FilePath;
      }

      return filePath;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao baixar arquivos');
    }
  }

  private async downloadAudio(fileName: string): Promise<string> {
    return await convertToMp3({ fileName });
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.rm(filePath);
  }

  private getPathFile(): string {
    const folderName = path.resolve('uploads');

    const pathFile = `${folderName}/${this.getFileName()}`;

    return pathFile;
  }

  private getFileName(): string {
    const fileID = this.mediaBody.id.split('_')[2];
    const mimetype =
      this.mediaBody.mimetype === 'audio/ogg; codecs=opus' ? 'ogg' : mime.extension(this.mediaBody.mimetype);

    const filename = `${fileID}-file-suport.${mimetype}`;
    return filename;
  }
}
