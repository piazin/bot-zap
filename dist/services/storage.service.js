"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const storage_1 = require("../storage");
class StorageService {
    getUserStorage() {
        if (!storage_1.storage[this.to]) {
            storage_1.storage[this.to] = {
                stage: 0,
            };
        }
        return storage_1.storage[this.to];
    }
    constructor(to) {
        this.to = to;
    }
    getStage() {
        return this.getUserStorage().stage;
    }
    setStage(stage) {
        this.getUserStorage().stage = stage;
    }
    getTicket() {
        return this.getUserStorage().isTicket;
    }
    setTicket(trueOrFalse) {
        this.getUserStorage().isTicket = trueOrFalse;
    }
    getProblemOrRequestMessage() {
        return this.getUserStorage().problemOrRequestMessage;
    }
    setProblemOrRequestMessage(message) {
        this.getUserStorage().problemOrRequestMessage = message;
    }
    setPathSuportImg(path) {
        this.getUserStorage().pathSuportImg = path;
    }
    getPathSuportImg() {
        return this.getUserStorage().pathSuportImg;
    }
    getUserEmail() {
        return this.getUserStorage().userEmail;
    }
    setUserEmail(email) {
        this.getUserStorage().userEmail = email;
    }
}
exports.StorageService = StorageService;
