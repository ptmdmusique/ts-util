"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var csv_parser_1 = __importDefault(require("csv-parser"));
var fs_1 = __importDefault(require("fs"));
var createTsFile = function (extension, fileName, data) {
    if (extension === void 0) { extension = "tsx"; }
    if (fileName === void 0) { fileName = "result"; }
    var outFileName = fileName + "." + extension;
    console.info("Writing to " + outFileName);
    fs_1.default.writeFile(outFileName, "export const data = " + JSON.stringify(data, null, 2), function (err) {
        if (err)
            throw err;
        console.log("Saved!");
    });
};
var transformStockSymbolCSV = function () {
    var result = [];
    fs_1.default.createReadStream("S&P500-Symbols.csv")
        .pipe(csv_parser_1.default())
        .on("data", function (data) {
        result.push(data);
    })
        .on("end", function () {
        var outData = [];
        result.forEach(function (_a) {
            var Symbol = _a.Symbol, Security = _a.Security;
            outData.push({ Symbol: Symbol, Security: Security });
        });
        createTsFile("tsx", "test", outData);
    });
};
transformStockSymbolCSV();
