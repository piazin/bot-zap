import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function convertToMp3({ fileName }: { fileName?: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = path.join(__dirname, '..', '..', '/uploads', fileName);
    const output = `${input}`.replace('ogg', 'mp3');

    ffmpeg(input)
      .outputOption(['-c:a libmp3lame', '-q:a 2'])
      .on('end', () => resolve(output))
      .on('error', (err) => reject(err.message))
      .save(output);
  });
}
