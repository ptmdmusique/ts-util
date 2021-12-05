// @ts-ignore
import emojiUnicode from "emoji-unicode";
// @ts-ignore
import toEmoji from "emoji-name-map";
// const emojiUnicode = require("emoji-unicode"),
//   toEmoji = require("emoji-name-map");
console.log(emojiUnicode("📻"));
// => 1f4fb

console.log(emojiUnicode.raw("📻"));
// => 128251

console.log(emojiUnicode("👩🏽‍💻"));
// => 1F469 1F3FD 200D 1F4BB

console.log(emojiUnicode.raw("👩🏽‍💻"));
// => 128105 127997 8205 128187

console.log(emojiUnicode.raw("🏳️‍🌈"));
// => 127987 65039 8205 127752

console.log(emojiUnicode("🏳️‍🌈"));
// => 1F3F3 FE0F 200D 1F308

console.log(emojiUnicode(toEmoji.get(":radio:")));
// => 1f4fb

console.log(emojiUnicode(toEmoji.get("radio")));
console.log('toEmoji.get("radio"):', toEmoji.get("%uD83D%uDCAB"));
console.log("\uD83D\uDE00");
