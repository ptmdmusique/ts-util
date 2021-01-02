"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fuse_js_1 = __importDefault(require("fuse.js"));
var options = {
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
var fuseData = [
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
var fuse = new fuse_js_1.default(fuseData, options);
// Change the pattern
var pattern = "2";
console.log(fuse.search(pattern).map(function (x) { return x.item; }));
