"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadImage = void 0;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
async function downloadImage(url) {
    const filepath = `uploads/${(0, crypto_1.randomUUID)()}.png`;
    const response = await (0, axios_1.default)({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        response.data
            .pipe(fs_1.default.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath));
    });
}
exports.downloadImage = downloadImage;
