import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { Message, Whatsapp } from 'venom-bot';

class DownloadingImg {
  async execute(
    client: Whatsapp,
    message: Message,
    to: string
  ): Promise<string> {
    try {
      const folderUploads = path.resolve('uploads');
      const buffer = await client.decryptFile(message);
      const fileID = message.id.split('_')[2];

      const fileName = `${folderUploads}/${fileID}-file-suport.${mime.extension(
        message.mimetype
      )}`;

      fs.writeFile(fileName, buffer, (err) => {
        if (err) {
          console.log(
            '🚀 ~ file: downloadingImage.ts:13 ~ fs.writeFile ~ err',
            err
          );
          throw new Error('Falha ao baixar arquivos');
        }
      });

      return fileName;
    } catch (error) {
      console.error(error);
    }
  }
}

export const downloadingImg = new DownloadingImg();
