"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageService = void 0;
const storage_1 = require("../storage");
class StageService {
    getStage({ to }) {
        if (storage_1.storage[to]) {
            return storage_1.storage[to].stage;
        }
        else {
            storage_1.storage[to] = {
                user: to,
                stage: 0,
            };
        }
        return storage_1.storage[to].stage;
    }
}
exports.StageService = StageService;
