import { Configuration, OpenAIApi } from 'openai';

export class OpenIaService {
  constructor(
    private readonly configuration = new Configuration({
      organization: 'org-bvRQkK5Qyl0V8lhPpHirrOEv',
      apiKey: process.env.OPENAI_API_KEY,
    }),
    private readonly openai = new OpenAIApi(configuration)
  ) {}

  async createCompletion(message: string): Promise<string | null> {
    try {
      const completation = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: message,
        temperature: 1,
        max_tokens: 2080,
        stop: ['\n\n\n\n'],
      });

      return completation.data.choices[0].text;
    } catch (error) {
      console.error(
        '🚀 ~ file: open_ia.service.ts:26 ~ OpenIaService ~ execute ~ error:',
        error.message
      );
      return null;
    }
  }

  async createImage(message: string): Promise<string | null> {
    const response = await this.openai.createImage({
      prompt: message,
      size: '1024x1024',
      n: 1,
    });

    return response.data.data[0].url;
  }
}
