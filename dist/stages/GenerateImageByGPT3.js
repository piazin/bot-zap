"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageByGPT3 = void 0;
const path_1 = __importDefault(require("path"));
const storage_1 = require("../storage");
const open_ia_service_1 = require("../services/open_ia.service");
const downloadImage_1 = require("../utils/downloadImage");
const deleteImage_1 = require("../utils/deleteImage");
class GenerateImageByGPT3 {
    async execute({ to, client, message }) {
        try {
            if (message.body === '#sair') {
                client.sendText(to, `Foi um prazer atende-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma  dúvida pode sempre me procurar! Obrigado.`);
                storage_1.storage[to].stage = 0;
                return;
            }
            await client.startTyping(to);
            const url = await new open_ia_service_1.OpenIaService().createImage(message.body);
            const pathImage = await (0, downloadImage_1.downloadImage)(url);
            await client.sendImage(to, path_1.default.resolve(pathImage));
            (0, deleteImage_1.deleteImage)(pathImage);
            await client.stopTyping(to);
            setTimeout(() => {
                storage_1.storage[to].stage = 0;
            }, 600000);
        }
        catch (error) {
            console.error('🚀 ~ file: GenerateImageByGPT3.ts:30 ~ GenerateImageByGPT3 ~ execute ~ error:', error);
            await client.sendText(to, 'Ops! Não foi possivel gerar está imagem :(');
        }
    }
}
exports.generateImageByGPT3 = new GenerateImageByGPT3();
