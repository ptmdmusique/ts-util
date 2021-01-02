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
var customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
var dayjs_1 = __importDefault(require("dayjs"));
var fs_1 = __importDefault(require("fs"));
var schema_1 = require("./schema");
dayjs_1.default.extend(customParseFormat_1.default);
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
var runQuestion2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var purpose, db, fosterSnapshot, detectorIdList_1, formattedTimeList, totalVolume_1, volumeList_1, dIndex, detectorId, maxQueryLength, start, curIdList, dailyDataList, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                purpose = "Question 2 query";
                console.time(purpose);
                db = firebase_1.default.firestore();
                console.log("Querying for Foster NB...");
                return [4 /*yield*/, db
                        .collection(schema_1.FirestoreCollection.StationData)
                        .where("locationText", "==", "Foster NB")
                        .get()];
            case 1:
                fosterSnapshot = _a.sent();
                detectorIdList_1 = [];
                fosterSnapshot.forEach(function (doc) {
                    var stationData = doc.data();
                    detectorIdList_1 = stationData.detectorIdList.map(function (id) { return id.toString(); });
                });
                console.log("Generating time string list...");
                formattedTimeList = generateTimeIntervalList("00:00:0", "24:00:00").map(function (time) { return "2011-09-15 " + time + "-07"; });
                totalVolume_1 = 0;
                volumeList_1 = [];
                console.log("Getting total volume for all detector in list...");
                dIndex = 0;
                _a.label = 2;
            case 2:
                if (!(dIndex < detectorIdList_1.length)) return [3 /*break*/, 7];
                detectorId = detectorIdList_1[dIndex];
                console.log("--- Calculating total volume for detector " + detectorId + "...");
                maxQueryLength = 10;
                start = 0;
                _a.label = 3;
            case 3:
                if (!(start < formattedTimeList.length)) return [3 /*break*/, 6];
                curIdList = formattedTimeList.slice(start, start + maxQueryLength);
                return [4 /*yield*/, db
                        .collection(schema_1.FirestoreCollection.LoopData)
                        .doc(detectorId)
                        .collection(schema_1.FirestoreCollection.DailyData)
                        .where(firebase_1.default.firestore.FieldPath.documentId(), "in", curIdList)
                        .get()];
            case 4:
                dailyDataList = _a.sent();
                dailyDataList.docs.forEach(function (doc) {
                    var docData = doc.data();
                    // console.log(totalVolume);
                    volumeList_1.push(docData.volume);
                    totalVolume_1 += docData.volume;
                });
                _a.label = 5;
            case 5:
                start += maxQueryLength;
                return [3 /*break*/, 3];
            case 6:
                dIndex++;
                return [3 /*break*/, 2];
            case 7:
                fs_1.default.writeFile("./out2.ts", "export const totalVolume = " + totalVolume_1 + ";", function () {
                    console.log("Write file 2 done");
                });
                console.timeEnd(purpose);
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
var runQuestion3 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var purpose, db, stationLength_1, travelTimeMap_1, fosterSnapshot, detectorIdList_2, formattedTimeList, _loop_1, dIndex, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                purpose = "Question 3 query";
                console.time(purpose);
                db = firebase_1.default.firestore();
                stationLength_1 = 0;
                travelTimeMap_1 = {};
                console.log("Querying for Foster NB...");
                return [4 /*yield*/, db
                        .collection(schema_1.FirestoreCollection.StationData)
                        .where("locationText", "==", "Foster NB")
                        .get()];
            case 1:
                fosterSnapshot = _a.sent();
                detectorIdList_2 = [];
                fosterSnapshot.forEach(function (doc) {
                    var stationData = doc.data();
                    detectorIdList_2 = stationData.detectorIdList.map(function (id) { return id.toString(); });
                    stationLength_1 = stationData.length;
                    // Creating map entries based on id of each detector
                    detectorIdList_2.forEach(function (id) {
                        travelTimeMap_1[id] = {};
                    });
                });
                console.log("Generating time string list...");
                formattedTimeList = generateTimeIntervalList("00:00:0", "24:00:00", 5, "minute").map(function (time) { return "2011-09-15 " + time + "-07"; });
                console.log("Getting travel time for all detector in list...");
                _loop_1 = function (dIndex) {
                    var detectorId, maxQueryLength, start, curIdList, dailyDataList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                detectorId = detectorIdList_2[dIndex];
                                console.log("--- Calculating travel time for detector " + detectorId + "...");
                                maxQueryLength = 10;
                                start = 0;
                                _a.label = 1;
                            case 1:
                                if (!(start < formattedTimeList.length)) return [3 /*break*/, 4];
                                curIdList = formattedTimeList.slice(start, start + maxQueryLength);
                                return [4 /*yield*/, db
                                        .collection(schema_1.FirestoreCollection.LoopData)
                                        .doc(detectorId)
                                        .collection(schema_1.FirestoreCollection.DailyData)
                                        .where(firebase_1.default.firestore.FieldPath.documentId(), "in", curIdList)
                                        .get()];
                            case 2:
                                dailyDataList = _a.sent();
                                dailyDataList.docs.forEach(function (doc) {
                                    var docData = doc.data();
                                    var speed = docData.speed;
                                    var travelTimeInSecond = speed > 0 ? (stationLength_1 / speed) * 3600 : 0;
                                    travelTimeMap_1[detectorId][doc.id] = travelTimeInSecond;
                                });
                                _a.label = 3;
                            case 3:
                                start += maxQueryLength;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                dIndex = 0;
                _a.label = 2;
            case 2:
                if (!(dIndex < detectorIdList_2.length)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1(dIndex)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                dIndex++;
                return [3 /*break*/, 2];
            case 5:
                fs_1.default.writeFile("./out3.json", JSON.stringify(travelTimeMap_1), function () {
                    console.log("Write file 3 done");
                });
                console.timeEnd(purpose);
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error(error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
var runQuestion5 = function (startLoc, endLoc, maxPath) {
    if (maxPath === void 0) { maxPath = 20; }
    return __awaiter(void 0, void 0, void 0, function () {
        var purpose, db, collectionRef, counter, curLoc, curDownStream_1, routeList, initialSnapshot, newStation, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    purpose = "Question 3 query";
                    console.time(purpose);
                    db = firebase_1.default.firestore();
                    collectionRef = db.collection(schema_1.FirestoreCollection.StationData);
                    counter = 0;
                    curLoc = startLoc;
                    curDownStream_1 = 0;
                    routeList = [curLoc];
                    console.log("Querying for " + curLoc + " doc...");
                    return [4 /*yield*/, collectionRef
                            .where("locationText", "==", startLoc)
                            .get()];
                case 1:
                    initialSnapshot = _a.sent();
                    if (initialSnapshot.empty) {
                        throw new Error("Start location " + startLoc + " not found senpai!!!");
                    }
                    else {
                        initialSnapshot.docs.forEach(function (doc) {
                            // Take only the first one so we use overwrite
                            var docData = doc.data();
                            curDownStream_1 = docData.downstream;
                        });
                    }
                    _a.label = 2;
                case 2:
                    if (!(endLoc !== curLoc && counter < maxPath)) return [3 /*break*/, 4];
                    counter++;
                    console.log("--- Querying from " + curLoc + " to downstream " + curDownStream_1);
                    return [4 /*yield*/, collectionRef.doc(curDownStream_1.toString()).get()];
                case 3:
                    newStation = (_a.sent()).data();
                    if (!newStation) {
                        throw new Error("Downstream " + curDownStream_1 + " not found senpai!!!");
                    }
                    curDownStream_1 = newStation.downstream;
                    curLoc = newStation.locationText;
                    routeList.push(curLoc);
                    return [3 /*break*/, 2];
                case 4:
                    if (endLoc != curLoc) {
                        console.error("--- Route not found from " + startLoc + " to " + endLoc);
                    }
                    else {
                        console.info("--- " + endLoc + " reached!");
                    }
                    console.log("Route searched:", routeList.join(" -> "));
                    fs_1.default.writeFile("./out5.json", JSON.stringify(routeList), function () {
                        console.log("Write file 5 done");
                    });
                    console.timeEnd(purpose);
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
runQuestion2();
// runQuestion3();
// runQuestion5("Johnson Cr NB", "Columbia to I-205 NB");
// const formattedTimeList = generateTimeIntervalList("00:00:0", "24:00:00").map(
//   (time) => `2011-09-15 ${time}-07`
// );
// console.log(formattedTimeList.length);
