import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';

config();

export class OpenIaService {
  constructor(
    private readonly configuration = new Configuration({
      organization: 'org-S3JUdsSdANNUe1W1by6q6HYz',
      apiKey: process.env.OPENAI_API_KEY,
    }),
    private readonly openai = new OpenAIApi(configuration)
  ) {}

  async execute(message: string) {
    const completation = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message,
      temperature: 0.7,
      max_tokens: 1000,
    });
    console.log(completation.data);

    return completation.data.choices[0].text;
  }
}
