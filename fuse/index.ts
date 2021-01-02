import Fuse from "fuse.js";

import { data } from "./data";

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  keys: ["name", "val"],
};
const fuseData = [
  {
    name: "a",
    val: ["1", "2", "3"],
  },
  {
    name: "b",
    val: ["4"],
  },
  {
    name: "c",
    val: ["10", "11"],
  },
];

const fuse = new Fuse(fuseData, options);

// Change the pattern
const pattern = "2";
console.log(fuse.search(pattern).map((x) => x.item));
