"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAttendantList = void 0;
const storage_1 = require("../storage");
const attendantList_1 = require("../constants/attendantList");
const download_img_service_1 = require("../services/download_img.service");
class SendAttendantList {
    async execute({ to, client, message, }) {
        if (message.isMedia || message.isMMS) {
            storage_1.storage[to].pathSuportImg = await download_img_service_1.downloadingImg.execute(client, message, to);
        }
        client.sendListMenu(to, 'Selecione um atendente', '', 'Clique para selecionar', attendantList_1.attendantList);
        storage_1.storage[to].stage = 4;
    }
}
exports.sendAttendantList = new SendAttendantList();
