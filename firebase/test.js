"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = __importDefault(require("firebase"));
var dayjs_1 = __importDefault(require("dayjs"));
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs_1.default.extend(customParseFormat);
firebase_1.default.initializeApp({
    apiKey: "AIzaSyAZa2Pn1bjNQeP-AvnInudUQHGwI-KhwpE",
    authDomain: "infinite-flame-756a5.firebaseapp.com",
    databaseURL: "https://infinite-flame-756a5.firebaseio.com",
    projectId: "infinite-flame-756a5",
    storageBucket: "infinite-flame-756a5.appspot.com",
    messagingSenderId: "912789506975",
    appId: "1:912789506975:web:b167efd92cbfb1e534cbaa",
    measurementId: "G-YP7JEXGEEW",
});
var db = firebase_1.default.firestore();
var generateTimeIntervalList = function (startTime, endTime, interval, intervalUnit) {
    if (interval === void 0) { interval = 20; }
    if (intervalUnit === void 0) { intervalUnit = "second"; }
    var resultList = [];
    var dateFormat = "HH:mm:ss";
    var startHour = dayjs_1.default(startTime, dateFormat);
    var endHour = dayjs_1.default(endTime, dateFormat);
    var curHour = startHour;
    resultList.push(curHour.format(dateFormat).toString());
    while (curHour.diff(endHour) !== 0) {
        curHour = curHour.add(interval, intervalUnit);
        resultList.push(curHour.format(dateFormat).toString());
    }
    return resultList;
};
var getAveTravelTime = function (idList) { return __awaiter(void 0, void 0, void 0, function () {
    var totalLength, totalSpeed, count, stationSnapshot, error_1, averageSpeed, averageTravelTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                totalLength = 0;
                totalSpeed = 0;
                count = 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db
                        .collection("stationData")
                        .where("highwayData.shortDirection", "==", "N")
                        .get()];
            case 2:
                stationSnapshot = _a.sent();
                if (stationSnapshot.empty) {
                    console.log("No matching docs");
                }
                stationSnapshot.forEach(function (doc) {
                    var docData = doc.data();
                    var detectorIdList = docData["detectorIdList"];
                    totalLength += docData["length"];
                    detectorIdList.forEach(function (detectorId) { return __awaiter(void 0, void 0, void 0, function () {
                        var i, dateData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < idList.length)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, db
                                            .collection("loopData")
                                            .doc(detectorId.toString())
                                            .collection("dailyData")
                                            .where(firebase_1.default.firestore.FieldPath.documentId(), "in", idList.slice(i, i + 10))
                                            .get()];
                                case 2:
                                    dateData = _a.sent();
                                    dateData.forEach(function (dailyDataDoc) {
                                        var dailyData = dailyDataDoc.data();
                                        var speed = dailyData["speed"];
                                        if (speed !== 0) {
                                            totalSpeed += speed;
                                            count++;
                                            console.log("current total speed: ", totalSpeed);
                                            console.log("current count: ", count);
                                        }
                                    });
                                    _a.label = 3;
                                case 3:
                                    i += 10;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 4];
            case 4:
                averageSpeed = totalSpeed / count;
                averageTravelTime = (totalLength / averageSpeed) * 60;
                console.log("totalSpeed: ", totalSpeed);
                console.log("count: ", count);
                console.log("totalLength: ", totalLength);
                console.log("averageTravelTime", averageTravelTime);
                return [2 /*return*/];
        }
    });
}); };
var morningInterval = generateTimeIntervalList("07:00:00", "09:00:00");
var afternoonInterval = generateTimeIntervalList("16:00:00", "18:00:00");
var combinedInterval = morningInterval
    .concat(afternoonInterval)
    .map(function (time) { return "2011-09-15 " + time + "-07"; });
getAveTravelTime(combinedInterval);
