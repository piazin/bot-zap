"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAttendantList = void 0;
const storage_1 = require("../storage");
const attendantList_1 = require("../constants/attendantList");
const download_img_service_1 = require("../services/download_img.service");
const invalidOption_1 = require("./invalidOption");
class SendAttendantList {
    async execute({ to, client, message, }) {
        try {
            if (message.isMedia || message.isMMS) {
                storage_1.storage[to].pathSuportImg = await download_img_service_1.downloadingImg.execute(client, message, to);
            }
            client.sendListMenu(to, 'Selecione um atendente', '', 'Clique para selecionar', attendantList_1.attendantList);
            storage_1.storage[to].stage = 4;
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.sendAttendantList = new SendAttendantList();
