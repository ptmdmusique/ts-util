"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var data = __importStar(require("./icon_json/set.json"));
// import * as data from "./icon_json/SW_Icon_Set.json";
var writeTSFileFromJSON = function () {
    // FA info
    var setPrefix = "ci"; // custom icon
    // const size = 20;
    var height = 1024;
    var ligatures = [];
    var unicode = "";
    // Extract and write to file
    var resultStr = "";
    var iconList = data.icons;
    iconList.forEach(function (icon) {
        var rawIconName = icon.tags[0];
        var splittedName = rawIconName.split("-");
        var iconType = splittedName.pop();
        var iconName = splittedName.join("-");
        var prefix = setPrefix + "o"; // custom icon outline
        switch (iconType) {
            case "outlined":
                prefix = setPrefix + "o";
                break;
            case "solid":
                prefix = setPrefix + "s";
                break;
        }
        var pathList = icon.paths;
        var width = icon.width || 1024;
        var objName = lodash_1.default.camelCase(rawIconName);
        var iconObj = {
            prefix: prefix,
            iconName: iconName,
            icon: [width, height, ligatures, unicode, pathList],
        };
        resultStr += "export const " + objName + " = " + JSON.stringify(iconObj) + ";\n";
    });
    fs_1.default.writeFile("./customIconList.tsx", resultStr, function (err) {
        if (err)
            throw err;
        console.log("Saved!");
    });
};
var listFromRegex = function (originalStr, eleRegex, attrRegex, redundantRegex) { var _a; return (_a = originalStr
    .match(eleRegex)) === null || _a === void 0 ? void 0 : _a.map(function (path) { var _a; return (_a = path.match(attrRegex)) === null || _a === void 0 ? void 0 : _a.map(function (d) { return d.replace(redundantRegex, ""); })[0]; }); };
// ! Unfinished! Cases left: rectangle, etc
var writeTSFileFromSVG = function () {
    var setPrefix = "ci"; // custom icon
    var ligatures = [];
    var unicode = "";
    // * Viewbox
    var viewBoxRegex = /viewBox="(.*?)"/g;
    var redundantViewBoxRegex = /viewBox=|"/g;
    // * Path
    var pathRegex = /<path\b([\s\S]*?)\/>/g;
    var dRegex = / d="(.*?)"/g;
    var redundantPathRegex = /\sd=|"/g;
    // * Polygon
    var polygonRegex = /<polygon\b([\s\S]*?)\/>/g;
    var pointRegex = / points="(.*?)"/g;
    var redundantPointRegex = /\spoints=|"/g;
    var fileNameList = fs_1.default.readdirSync("./icons");
    var resultStr = "";
    fileNameList.forEach(function (fileName) {
        var _a, _b;
        var result = fs_1.default.readFileSync("./icons/" + fileName, "utf-8");
        var rawIconName = fileName;
        var splittedName = rawIconName.split("-");
        var iconType = splittedName.pop();
        var iconName = splittedName.join("-");
        var prefix = setPrefix + "o"; // custom icon outline
        switch (iconType) {
            case "outlined":
                prefix = setPrefix + "o";
                break;
            case "solid":
                prefix = setPrefix + "s";
                break;
        }
        var viewBoxSpec = (_a = result
            .match(viewBoxRegex)) === null || _a === void 0 ? void 0 : _a[0].replace(redundantViewBoxRegex, "").split(" ");
        var width = parseFloat((viewBoxSpec === null || viewBoxSpec === void 0 ? void 0 : viewBoxSpec[2]) || "0");
        var height = parseFloat((viewBoxSpec === null || viewBoxSpec === void 0 ? void 0 : viewBoxSpec[3]) || "0");
        var pathList = listFromRegex(result, pathRegex, dRegex, redundantPathRegex);
        var pointList = (_b = listFromRegex(result, polygonRegex, pointRegex, redundantPointRegex)) === null || _b === void 0 ? void 0 : _b.map(function (point) { return "M" + point + "z"; });
        var finalList = []
            .concat(pathList, pointList)
            .filter(function (ele) { return ele != null; });
        var objName = lodash_1.default.camelCase(rawIconName);
        var iconObj = {
            prefix: prefix,
            iconName: iconName,
            icon: [width, height, ligatures, unicode, finalList],
        };
        resultStr += "export const " + objName + " = " + JSON.stringify(iconObj) + ";\n";
    });
    fs_1.default.writeFile("./customIconList2.tsx", resultStr, function (err) {
        if (err)
            throw err;
        console.log("Saved!");
    });
};
// writeTSFileFromSVG();
writeTSFileFromJSON();
