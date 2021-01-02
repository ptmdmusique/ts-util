import firebase from "firebase";
import dayjs from "dayjs";

import customParseFormat = require("dayjs/plugin/customParseFormat");

import { DailyData, Station } from "./schema";

dayjs.extend(customParseFormat);

firebase.initializeApp({
  apiKey: "AIzaSyAZa2Pn1bjNQeP-AvnInudUQHGwI-KhwpE",
  authDomain: "infinite-flame-756a5.firebaseapp.com",
  databaseURL: "https://infinite-flame-756a5.firebaseio.com",
  projectId: "infinite-flame-756a5",
  storageBucket: "infinite-flame-756a5.appspot.com",
  messagingSenderId: "912789506975",
  appId: "1:912789506975:web:b167efd92cbfb1e534cbaa",
  measurementId: "G-YP7JEXGEEW",
});

const db = firebase.firestore();
const generateTimeIntervalList = (
  startTime: string,
  endTime: string,
  interval: number = 20,
  intervalUnit: "second" | "day" | "minute" = "second"
): Array<string> => {
  const resultList: Array<string> = [];
  const dateFormat = "HH:mm:ss";
  const startHour = dayjs(startTime, dateFormat);
  const endHour = dayjs(endTime, dateFormat);
  let curHour = startHour;
  resultList.push(curHour.format(dateFormat).toString());
  while (curHour.diff(endHour) !== 0) {
    curHour = curHour.add(interval, intervalUnit);
    resultList.push(curHour.format(dateFormat).toString());
  }
  return resultList;
};
const getAveTravelTime = async (idList: string[]) => {
  let totalLength = 0;
  let totalSpeed = 0;
  let count = 0;

  try {
    const stationSnapshot = await db
      .collection("stationData")
      .where("highwayData.shortDirection", "==", "N")
      .get();

    if (stationSnapshot.empty) {
      console.log("No matching docs");
    }

    stationSnapshot.forEach((doc) => {
      const docData = doc.data() as Station;
      const detectorIdList = docData["detectorIdList"];
      totalLength += docData["length"];

      detectorIdList.forEach(async (detectorId) => {
        for (var i = 0; i < idList.length; i += 10) {
          const dateData = await db
            .collection("loopData")
            .doc(detectorId.toString())
            .collection("dailyData")
            .where(
              firebase.firestore.FieldPath.documentId(),
              "in",
              idList.slice(i, i + 10)
            )
            .get();
          dateData.forEach((dailyDataDoc) => {
            const dailyData = dailyDataDoc.data() as DailyData;
            const speed = dailyData["speed"];
            if (speed !== 0) {
              totalSpeed += speed;
              count++;
              console.log("current total speed: ", totalSpeed);
              console.log("current count: ", count);
            }
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
  }

  const averageSpeed = totalSpeed / count;
  const averageTravelTime = (totalLength / averageSpeed) * 60;
  console.log("totalSpeed: ", totalSpeed);
  console.log("count: ", count);
  console.log("totalLength: ", totalLength);
  console.log("averageTravelTime", averageTravelTime);
};

const morningInterval = generateTimeIntervalList("07:00:00", "09:00:00");
const afternoonInterval = generateTimeIntervalList("16:00:00", "18:00:00");
const combinedInterval = morningInterval
  .concat(afternoonInterval)
  .map((time) => "2011-09-15 " + time + "-07");

getAveTravelTime(combinedInterval);
