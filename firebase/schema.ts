export enum DailyDataStatus {
  Inhibited,
  Disabled,
  OK,
  Suspect,
  SoftFailed,
  HardFailed,
}

export interface DailyData {
  startTime: string;
  volume: number;
  speed: number;
  occupancy?: number;
  status: DailyDataStatus;
  dqflags: number;
}

export interface Detector {
  dailyDataSubCollection: Record<string, DailyData>;
  detectorId: number;
  laneNumber: number;
  detectorClass: number;
  locationText: string;
  stationId: number;
  milepost: number;
}

export enum Direction {
  N = "North",
  S = "South",
  W = "West",
  E = "East",
}

export interface Highway {
  highwayId: number;
  shortDirection: Direction;
  highwayName: string;
}

export interface Station {
  stationId: number;
  highwayData: Record<string, Highway>;

  milepost: number;
  locationText: string;
  upstream: number;
  downstream: number;

  stationsClass: number;
  numberLanes: number;
  latLon: string;
  length: number;
  detectorIdList: Array<string>;
}

export enum FirestoreCollection {
  StationData = "stationData",
  LoopData = "loopData",
  DailyData = "dailyData",
}
