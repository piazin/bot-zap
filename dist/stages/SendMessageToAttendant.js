"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToAttendant = void 0;
const storage_1 = require("../storage");
const attendantList_1 = require("../constants/attendantList");
const invalidOption_1 = require("./invalidOption");
class SendMessageToAttendant {
    async execute({ to, client, message, messageResponse, }) {
        try {
            if (!message?.listResponse)
                return invalidOption_1.invalidOption.execute({ to, client });
            const attendantRequest = message.listResponse.title;
            if (!message?.listResponse) {
                invalidOption_1.invalidOption.execute({ to, client });
                return;
            }
            let thisAttendantExist = attendantList_1.attendantsPhoneNumber.find((attendant) => attendant.name === attendantRequest);
            if (!thisAttendantExist) {
                invalidOption_1.invalidOption.execute({ to, client });
                return;
            }
            client.sendText(to, `Estou enviando o seu problema para o atendente ${attendantRequest}.`);
            client.sendText(thisAttendantExist.number, `Olá ${thisAttendantExist.name},\n\nUsuário(a): ${message.notifyName} te enviou um novo chamado, com o seguinte problema: \n\n ${messageResponse}`);
            if (storage_1.storage[to]?.pathSuportImg) {
                await client.sendImage(thisAttendantExist.number, storage_1.storage[to].pathSuportImg, 'File suport');
            }
            client.sendContactVcard(thisAttendantExist.number, message.from, message.notifyName);
            client.sendText(to, 'Tudo certo! Em breve o atendente entrara em contato');
            storage_1.storage[to].stage = 0;
            storage_1.storage[to].pathSuportImg = null;
        }
        catch (error) {
            console.error('🚀 ~ file: TalkOrNewCall.ts:52 ~ TalkOrNewCall ~ execute ~ error:', error);
            return invalidOption_1.invalidOption.execute({ to, client });
        }
    }
}
exports.sendMessageToAttendant = new SendMessageToAttendant();
