"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateImageByGPT3 = void 0;
const path_1 = __importDefault(require("path"));
const openIa_service_1 = require("../services/openIa.service");
const downloadImage_1 = require("../utils/downloadImage");
const deleteImage_1 = require("../utils/deleteImage");
const storage_service_1 = require("../services/storage.service");
class GenerateImageByGPT3 {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message }) {
        try {
            if (message.body === '#sair') {
                client.sendText(to, `Foi um prazer atende-lo(a) ${message.sender.pushname} 🤝, caso tenha mais alguma  dúvida pode sempre me procurar! Obrigado.`);
                this.storageService.setStage(0);
                return;
            }
            await client.startTyping(to);
            const url = await new openIa_service_1.OpenIaService().createImage(message.body);
            const pathImage = await (0, downloadImage_1.downloadImage)(url);
            await client.sendImage(to, path_1.default.resolve(pathImage));
            (0, deleteImage_1.deleteImage)(pathImage);
            await client.stopTyping(to);
            setTimeout(() => {
                this.storageService.setStage(0);
            }, 600000);
        }
        catch (error) {
            console.error('🚀 ~ file: GenerateImageByGPT3.ts:30 ~ GenerateImageByGPT3 ~ execute ~ error:', error);
            await client.sendText(to, 'Ops! Não foi possivel gerar está imagem :(');
        }
    }
}
exports.GenerateImageByGPT3 = GenerateImageByGPT3;
