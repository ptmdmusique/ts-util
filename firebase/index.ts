import firebase from "firebase";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import fs from "fs";

import { DailyData, FirestoreCollection, Station } from "./schema";

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

const runQuestion2 = async () => {
  try {
    const purpose = "Question 2 query";
    console.time(purpose);

    const db = firebase.firestore();

    console.log("Querying for Foster NB...");
    const fosterSnapshot = await db
      .collection(FirestoreCollection.StationData)
      .where("locationText", "==", "Foster NB")
      .get();

    // First get the detector list
    let detectorIdList: Array<string> = [];
    fosterSnapshot.forEach((doc) => {
      const stationData = doc.data() as Station;
      detectorIdList = stationData.detectorIdList.map((id) => id.toString());
    });

    console.log("Generating time string list...");
    // Add 2011-09-15 and -07 (timezone offset)
    const formattedTimeList = generateTimeIntervalList(
      "00:00:0",
      "24:00:00"
    ).map((time) => `2011-09-15 ${time}-07`);

    let totalVolume = 0;
    const volumeList: Array<number> = [];
    console.log("Getting total volume for all detector in list...");
    for (let dIndex = 0; dIndex < detectorIdList.length; dIndex++) {
      const detectorId = detectorIdList[dIndex];
      console.log(`--- Calculating total volume for detector ${detectorId}...`);

      // Since query only accepts array with 10 elements at most
      //  we need to split the idList into chunks
      const maxQueryLength = 10;
      for (
        let start = 0;
        start < formattedTimeList.length;
        start += maxQueryLength
      ) {
        const curIdList = formattedTimeList.slice(
          start,
          start + maxQueryLength
        );

        const dailyDataList = await db
          .collection(FirestoreCollection.LoopData)
          .doc(detectorId)
          .collection(FirestoreCollection.DailyData)
          .where(firebase.firestore.FieldPath.documentId(), "in", curIdList)
          .get();

        dailyDataList.docs.forEach((doc) => {
          const docData = doc.data() as DailyData;
          // console.log(totalVolume);
          volumeList.push(docData.volume);
          totalVolume += docData.volume;
        });
      }
    }

    fs.writeFile(
      "./out2.ts",
      `export const totalVolume = ${totalVolume};`,
      () => {
        console.log("Write file 2 done");
      }
    );
    console.timeEnd(purpose);
  } catch (error) {
    console.error(error);
  }
};

const runQuestion3 = async () => {
  try {
    const purpose = "Question 3 query";
    console.time(purpose);

    const db = firebase.firestore();

    let stationLength = 0;
    const travelTimeMap: Record<string, Record<string, number>> = {};

    console.log("Querying for Foster NB...");
    const fosterSnapshot = await db
      .collection(FirestoreCollection.StationData)
      .where("locationText", "==", "Foster NB")
      .get();

    // First get the detector list
    let detectorIdList: Array<string> = [];
    fosterSnapshot.forEach((doc) => {
      const stationData = doc.data() as Station;

      detectorIdList = stationData.detectorIdList.map((id) => id.toString());
      stationLength = stationData.length;

      // Creating map entries based on id of each detector
      detectorIdList.forEach((id) => {
        travelTimeMap[id] = {};
      });
    });

    console.log("Generating time string list...");
    // Add 2011-09-15 and -07 (timezone offset)
    const formattedTimeList = generateTimeIntervalList(
      "00:00:0",
      "24:00:00",
      5,
      "minute"
    ).map((time) => `2011-09-15 ${time}-07`);

    console.log("Getting travel time for all detector in list...");
    for (let dIndex = 0; dIndex < detectorIdList.length; dIndex++) {
      const detectorId = detectorIdList[dIndex];
      console.log(`--- Calculating travel time for detector ${detectorId}...`);

      // Since query only accepts array with 10 elements at most
      //  we need to split the idList into chunks
      const maxQueryLength = 10;
      for (
        let start = 0;
        start < formattedTimeList.length;
        start += maxQueryLength
      ) {
        const curIdList = formattedTimeList.slice(
          start,
          start + maxQueryLength
        );

        const dailyDataList = await db
          .collection(FirestoreCollection.LoopData)
          .doc(detectorId)
          .collection(FirestoreCollection.DailyData)
          .where(firebase.firestore.FieldPath.documentId(), "in", curIdList)
          .get();

        dailyDataList.docs.forEach((doc) => {
          const docData = doc.data() as DailyData;

          const speed = docData.speed;
          const travelTimeInSecond =
            speed > 0 ? (stationLength / speed) * 3600 : 0;
          travelTimeMap[detectorId][doc.id] = travelTimeInSecond;
        });
      }
    }

    fs.writeFile("./out3.json", JSON.stringify(travelTimeMap), () => {
      console.log("Write file 3 done");
    });
    console.timeEnd(purpose);
  } catch (error) {
    console.error(error);
  }
};

const runQuestion5 = async (startLoc: string, endLoc: string, maxPath = 20) => {
  try {
    const purpose = "Question 3 query";
    console.time(purpose);

    const db = firebase.firestore();
    const collectionRef = db.collection(FirestoreCollection.StationData);

    let counter = 0;
    let curLoc = startLoc;
    let curDownStream = 0;
    const routeList: Array<string> = [curLoc];

    console.log(`Querying for ${curLoc} doc...`);
    const initialSnapshot = await collectionRef
      .where("locationText", "==", startLoc)
      .get();
    if (initialSnapshot.empty) {
      throw new Error(`Start location ${startLoc} not found senpai!!!`);
    } else {
      initialSnapshot.docs.forEach((doc) => {
        // Take only the first one so we use overwrite
        const docData = doc.data() as Station;
        curDownStream = docData.downstream;
      });
    }

    while (endLoc !== curLoc && counter < maxPath) {
      counter++;
      console.log(`--- Querying from ${curLoc} to downstream ${curDownStream}`);

      const newStation = (
        await collectionRef.doc(curDownStream.toString()).get()
      ).data() as Station | undefined;

      if (!newStation) {
        throw new Error(`Downstream ${curDownStream} not found senpai!!!`);
      }

      curDownStream = newStation.downstream;
      curLoc = newStation.locationText;
      routeList.push(curLoc);
    }

    if (endLoc != curLoc) {
      console.error(`--- Route not found from ${startLoc} to ${endLoc}`);
    } else {
      console.info(`--- ${endLoc} reached!`);
    }
    console.log("Route searched:", routeList.join(" -> "));

    fs.writeFile("./out5.json", JSON.stringify(routeList), () => {
      console.log("Write file 5 done");
    });
    console.timeEnd(purpose);
  } catch (error) {
    console.error(error);
  }
};

runQuestion2();
// runQuestion3();
// runQuestion5("Johnson Cr NB", "Columbia to I-205 NB");

// const formattedTimeList = generateTimeIntervalList("00:00:0", "24:00:00").map(
//   (time) => `2011-09-15 ${time}-07`
// );
// console.log(formattedTimeList.length);

