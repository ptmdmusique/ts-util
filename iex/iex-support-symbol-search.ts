import Fuse from "fuse.js";
import { iexSupportList } from "./supported-symbol-list";

const options = {
  keys: ["symbol", "name"],
  threshold: 0.3,
};

const fuse = new Fuse(iexSupportList, options);

const result = fuse
  .search("Apple")
  .map((entry) => entry.item)
  .filter((entry) => entry.isEnabled);
console.log("result:", result);

// console.log(iexSupportList.slice(0, 1));
