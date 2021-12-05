const testStr = `
  <img src='https://storage.googleapis.com/stockwise-f24fe.appspot.com/userImageList/ImBDrZ9ao4ctU3voxUnvVjXKzkX2/8b20da59-7ba1-462a-9cc9-6fd13232acc5..png,png'/>
  <img src='image1'/>
`;

var regex = /<img\s+[^>]*?src=("|')([^"']+)\1/gm;
var src = testStr.match(regex);

const matches = testStr.matchAll(regex);
for (const match of matches) {
  console.log(match[2]);
}
// ?.map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));

// console.log(test);

const testStr2 =
  "mai-sakurajima-seishun-buta-yarou-wa-bunny-girl-senpai-no-yume-o-minai-anime-hd-wallpaper-preview.png";
const regex2 = /\.[0-9a-z]+$/gm;
console.log(testStr2.match(regex2));
