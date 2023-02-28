"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenIaService = void 0;
const openai_1 = require("openai");
class OpenIaService {
    constructor(configuration = new openai_1.Configuration({
        organization: 'org-S3JUdsSdANNUe1W1by6q6HYz',
        apiKey: process.env.OPENAI_API_KEY,
    }), openai = new openai_1.OpenAIApi(configuration)) {
        this.configuration = configuration;
        this.openai = openai;
    }
    async execute(message) {
        try {
            const completation = await this.openai.createCompletion({
                model: 'text-davinci-003',
                prompt: message,
                temperature: 0.6,
                max_tokens: 1000,
            });
            return completation.data.choices[0].text;
        }
        catch (error) {
            console.error('🚀 ~ file: open_ia.service.ts:26 ~ OpenIaService ~ execute ~ error:', error);
            return null;
        }
    }
}
exports.OpenIaService = OpenIaService;
