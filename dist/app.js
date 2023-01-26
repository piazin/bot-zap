"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const venom_bot_1 = require("venom-bot");
const stages_1 = require("./stages");
const stage_service_1 = require("./services/stage.service");
const { getStage } = new stage_service_1.StageService();
var messageResponse;
(0, venom_bot_1.create)('suport-t.i-sl')
    .then((client) => start(client))
    .catch((err) => console.error('🚀 ~ file: app.ts:6 ~ err', err));
function start(client) {
    client.onMessage((message) => {
        if (message.isGroupMsg)
            return;
        const to = message.from;
        var stage = getStage({ to });
        if (stage === 2) {
            messageResponse = stages_1.stages[stage].stage.execute({
                to,
                client,
                message,
            });
            return;
        }
        stages_1.stages[stage].stage.execute({ to, client, message, messageResponse });
    });
}
