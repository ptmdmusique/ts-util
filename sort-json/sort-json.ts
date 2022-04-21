const inFilePath = process.argv[2];
const outFilePath = process.argv[3];

import fs from "fs";
if (
  inFilePath.split(".").pop() !== "json" ||
  outFilePath.split(".").pop() !== "json"
) {
  console.error("Both in and out file must be json files");
  process.exit(1);
}

const rawdata = fs.readFileSync(inFilePath);
const jsonData = JSON.parse(rawdata.toString());

const sortJson = (json: object) => {
  const keys = Object.keys(json);
  keys.sort();

  const sortedJson = {};
  keys.forEach((key) => {
    if (Array.isArray(json[key])) {
      sortedJson[key] = json[key].map((item) => {
        if (typeof item === "object") {
          return sortJson(item);
        }

        return item;
      });
    } else if (typeof json[key] === "object") {
      sortedJson[key] = sortJson(json[key]);
    } else {
      sortedJson[key] = json[key];
    }
  });

  return sortedJson;
};

const outData = JSON.stringify(sortJson(jsonData), null, 2);
fs.writeFileSync(outFilePath, outData);

console.log(`Result written from ${inFilePath} to ${outFilePath}`);
