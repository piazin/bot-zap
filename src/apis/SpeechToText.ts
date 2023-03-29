import fs from 'fs';
import { SpeechClient } from '@google-cloud/speech';

export class SpeechToText {
  private client: SpeechClient;

  constructor() {
    this.client = new SpeechClient();
  }

  async execute(audioPath: string): Promise<string> {
    try {
      const file = fs.readFileSync(audioPath);
      const audioBytes = file.toString('base64');

      const audio = {
        content: audioBytes,
      };

      const config = {
        encoding: 'MP3',
        sampleRateHertz: 16000,
        languageCode: 'pt-BR',
      };

      const request = {
        audio: audio,
        config: config,
      };

      //@ts-ignore
      const [response] = await this.client.recognize(request);

      const transcript = response.results
        .map((result) => result.alternatives[0].transcript)
        .join(' ');

      return transcript;
    } catch (err) {
      console.error(err);
      return 'Ops, ocorreu um erro';
    }
  }
}
