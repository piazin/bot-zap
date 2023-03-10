"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestUserEmail = void 0;
const storage_1 = require("../storage");
const download_img_service_1 = require("../services/download_img.service");
const invalidOption_1 = require("./invalidOption");
class RequestUserEmail {
    async execute({ to, client, message, }) {
        try {
            var mimetypeaccepted = ['image/jpeg', undefined];
            if (!mimetypeaccepted.includes(message.mimetype)) {
                invalidOption_1.invalidOption.execute({ to, client });
                return;
            }
            if (message.isMedia || message.isMMS) {
                storage_1.storage[to].pathSuportImg = await download_img_service_1.downloadingImg.execute(client, message, to);
            }
            client.sendText(to, 'Qual seu email?');
            storage_1.storage[to].stage = 6;
            return message.body;
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.requestUserEmail = new RequestUserEmail();
