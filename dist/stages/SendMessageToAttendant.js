"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageToAttendant = void 0;
const invalidOption_1 = require("./invalidOption");
const storage_service_1 = require("../services/storage.service");
const attendantList_1 = require("../constants/attendantList");
class SendMessageToAttendant {
    constructor(to) {
        this.storageService = new storage_service_1.StorageService(to);
    }
    async execute({ to, client, message, }) {
        try {
            if (!message?.listResponse)
                return invalidOption_1.invalidOption.execute({ to, client });
            const attendantRequest = message.listResponse.title;
            let thisAttendantExist = attendantList_1.attendantsPhoneNumber.find((attendant) => attendant.name === attendantRequest);
            if (!thisAttendantExist) {
                invalidOption_1.invalidOption.execute({ to, client });
                return;
            }
            var problemOrRequestMessage = this.storageService.getProblemOrRequestMessage();
            var pathSuportImg = this.storageService.getPathSuportImg();
            await Promise.all([
                client.sendText(thisAttendantExist.number, `Olá ${thisAttendantExist.name},\n\nUsuário(a): ${message.notifyName} te enviou um novo chamado, com o seguinte problema: \n\n ${problemOrRequestMessage}`),
                pathSuportImg &&
                    client.sendImage(thisAttendantExist.number, pathSuportImg, 'File suport'),
                client.sendContactVcard(thisAttendantExist.number, message.from, message.notifyName),
                client.sendText(to, 'Tudo certo! Em breve o atendente entrará em contato.'),
            ]);
            this.storageService.setStage(0);
            this.storageService.setPathSuportImg(null);
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.SendMessageToAttendant = SendMessageToAttendant;
