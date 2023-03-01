import fs from 'fs';
import path from 'path';

export function deleteImage(pathImage: string): void {
  fs.rmSync(path.resolve(pathImage));
}
