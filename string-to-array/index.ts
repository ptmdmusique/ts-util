import fs from "fs";

const str =
  "🚑 🖲 ⛵️ 🕸 ✳️ 🚤 🛩 🚊 🏒 🌎 💴 🈯️ 🚚 🏙 🚗 ⏩ ⛺️ 🌵 🌕 👀 🔎 🎌 ▫️ 📱 ⁉️ 🎄 🕷 👪 ♒️ ✝";

fs.writeFile("out.json", JSON.stringify(str.split(" ")), () => {});
