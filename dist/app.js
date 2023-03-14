"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const venom_bot_1 = require("venom-bot");
const stages_1 = require("./stages");
const storage_service_1 = require("./services/storage.service");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
(0, venom_bot_1.create)('suport-t.i-sl')
    .then((client) => start(client))
    .catch((err) => console.error('🚀 ~ file: app.ts:6 ~ err', err));
function start(client) {
    client.onMessage((message) => {
        if (message.isGroupMsg)
            return;
        const to = message.from;
        const storageService = new storage_service_1.StorageService(to);
        var stage = storageService.getStage();
        var currentStage = stages_1.stages[stage].stage;
        //@ts-ignore
        new currentStage(to).execute({ to, client, message });
    });
}
