"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadingImg = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mime_types_1 = __importDefault(require("mime-types"));
class DownloadingImg {
    async execute(client, message) {
        try {
            const folderUploads = path_1.default.resolve('uploads');
            const buffer = await client.decryptFile(message);
            const fileID = message.id.split('_')[2];
            const fileName = `${folderUploads}/${fileID}-file-suport.${mime_types_1.default.extension(message.mimetype)}`;
            await promises_1.default.writeFile(fileName, buffer);
            return fileName;
        }
        catch (error) {
            console.error(error);
            throw new Error('Falha ao baixar arquivos');
        }
    }
}
exports.downloadingImg = new DownloadingImg();
