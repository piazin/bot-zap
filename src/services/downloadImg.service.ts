import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';
import { Message, Whatsapp } from '@wppconnect-team/wppconnect';

class DownloadingImg {
  async execute(client: Whatsapp, message: Message): Promise<string> {
    try {
      const folderUploads = path.resolve('uploads');
      const buffer = await client.decryptFile(message);
      const fileID = message.id.split('_')[2];

      const fileName = `${folderUploads}/${fileID}-file-suport.${mime.extension(
        message.mimetype
      )}`;

      await fs.writeFile(fileName, buffer);

      return fileName;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao baixar arquivos');
    }
  }
}

export const downloadingImg = new DownloadingImg();
