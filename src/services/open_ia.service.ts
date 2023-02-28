import { Configuration, OpenAIApi } from 'openai';

export class OpenIaService {
  constructor(
    private readonly configuration = new Configuration({
      organization: 'org-S3JUdsSdANNUe1W1by6q6HYz',
      apiKey: process.env.OPENAI_API_KEY,
    }),
    private readonly openai = new OpenAIApi(configuration)
  ) {}

  async execute(message: string): Promise<string | null> {
    try {
      const completation = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: message,
        temperature: 0.6,
        max_tokens: 1000,
      });

      return completation.data.choices[0].text;
    } catch (error) {
      console.error(
        '🚀 ~ file: open_ia.service.ts:26 ~ OpenIaService ~ execute ~ error:',
        error
      );
      return null;
    }
  }
}
