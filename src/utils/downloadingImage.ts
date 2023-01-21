import fs from 'fs';
import mime from 'mime-types';
import { Message, Whatsapp } from 'venom-bot';

export async function downloadingImage(client: Whatsapp, message: Message) {
  try {
    const buffer = await client.decryptFile(message);
    const fileName = `${message.id}-img-suport.${mime.extension(
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
  } catch (error) {
    console.error(error);
  }
}
