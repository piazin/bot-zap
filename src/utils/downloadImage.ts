import fs from 'fs';
import axios from 'axios';
import { randomUUID } from 'crypto';

export async function downloadImage(url: string): Promise<string> {
  const filepath = `uploads/${randomUUID()}.png`;
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });
}
