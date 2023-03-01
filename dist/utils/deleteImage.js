"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function deleteImage(pathImage) {
    fs_1.default.rmSync(path_1.default.resolve(pathImage));
}
exports.deleteImage = deleteImage;
