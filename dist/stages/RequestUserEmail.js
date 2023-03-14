"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestUserEmail = void 0;
const invalidOption_1 = require("./invalidOption");
const storage_service_1 = require("../services/storage.service");
const downloadImg_service_1 = require("../services/downloadImg.service");
const ACCEPTED_MIME_TYPES = ['image/jpeg', undefined];
class RequestUserEmail {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message, }) {
        try {
            if (!ACCEPTED_MIME_TYPES.includes(message.mimetype)) {
                await invalidOption_1.invalidOption.execute({ to, client });
                return;
            }
            if (message.isMedia || message.isMMS) {
                var path = await downloadImg_service_1.downloadingImg.execute(client, message);
                this.storageService.setPathSuportImg(path);
            }
            await client.sendText(to, 'Por favor, poderia me informar seu endereço de e-mail?');
            this.storageService.setStage(6);
        }
        catch (error) {
            console.error(`Error in RequestUserEmail.execute: ${error}`);
            await invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.RequestUserEmail = RequestUserEmail;
