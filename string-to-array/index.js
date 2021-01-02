"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var str = "🚑 🖲 ⛵️ 🕸 ✳️ 🚤 🛩 🚊 🏒 🌎 💴 🈯️ 🚚 🏙 🚗 ⏩ ⛺️ 🌵 🌕 👀 🔎 🎌 ▫️ 📱 ⁉️ 🎄 🕷 👪 ♒️ ✝";
fs_1.default.writeFile("out.json", JSON.stringify(str.split(" ")), function () { });
