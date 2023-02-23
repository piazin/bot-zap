import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';

config();

class OpenIaService {
  constructor(
    private readonly configuration = new Configuration({
      apiKey: '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',
    }),
    private readonly openai = new OpenAIApi(configuration)
  ) {}

  async execute() {
    const completation = await this.openai.createCompletion({
      model: 'text-davinci-002',
      prompt: 'como criar uma pagina web?',
      temperature: 0.9,
      max_tokens: 250,
    });

    console.log(completation.data.choices[0].text);
  }
}

new OpenIaService().execute();
