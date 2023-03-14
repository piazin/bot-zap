import fs from 'fs/promises';
import path from 'path';

export async function deleteImage(pathImage: string): Promise<void> {
  await fs.rm(path.resolve(pathImage));
}
