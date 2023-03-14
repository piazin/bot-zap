"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAttendantList = void 0;
const storage_1 = require("../storage");
const attendantList_1 = require("../constants/attendantList");
const downloadImg_service_1 = require("../services/downloadImg.service");
const invalidOption_1 = require("./invalidOption");
const storage_service_1 = require("../services/storage.service");
class SendAttendantList {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message, }) {
        try {
            if (message.isMedia || message.isMMS) {
                storage_1.storage[to].pathSuportImg = await downloadImg_service_1.downloadingImg.execute(client, message);
            }
            await client.sendListMenu(to, 'Selecione um atendente', '', 'Clique para selecionar', attendantList_1.attendantList);
            this.storageService.setStage(4);
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.SendAttendantList = SendAttendantList;
