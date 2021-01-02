"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreCollection = exports.Direction = exports.DailyDataStatus = void 0;
var DailyDataStatus;
(function (DailyDataStatus) {
    DailyDataStatus[DailyDataStatus["Inhibited"] = 0] = "Inhibited";
    DailyDataStatus[DailyDataStatus["Disabled"] = 1] = "Disabled";
    DailyDataStatus[DailyDataStatus["OK"] = 2] = "OK";
    DailyDataStatus[DailyDataStatus["Suspect"] = 3] = "Suspect";
    DailyDataStatus[DailyDataStatus["SoftFailed"] = 4] = "SoftFailed";
    DailyDataStatus[DailyDataStatus["HardFailed"] = 5] = "HardFailed";
})(DailyDataStatus = exports.DailyDataStatus || (exports.DailyDataStatus = {}));
var Direction;
(function (Direction) {
    Direction["N"] = "North";
    Direction["S"] = "South";
    Direction["W"] = "West";
    Direction["E"] = "East";
})(Direction = exports.Direction || (exports.Direction = {}));
var FirestoreCollection;
(function (FirestoreCollection) {
    FirestoreCollection["StationData"] = "stationData";
    FirestoreCollection["LoopData"] = "loopData";
    FirestoreCollection["DailyData"] = "dailyData";
})(FirestoreCollection = exports.FirestoreCollection || (exports.FirestoreCollection = {}));
