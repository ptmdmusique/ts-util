// @ts-ignore
import * as data from "./Musical_Instruments_5";
import fs from "fs";

// console.log(data);

data.default.forEach((element, index) => {
  fs.writeFileSync(
    `./data/test-${index}.txt`,
    JSON.stringify(element.reviewText),
  );
});
