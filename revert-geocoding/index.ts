import axios from "axios";
import { logInfo, logSuccess } from "../log/log";
import * as data from "./address.json";
import fs from "fs";

const revertGeocodingUrl =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?";
const geocodingUrl =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

const runGeocoding = async () => {
  const startTime = Date.now();

  const locationList: any[] = [];
  const addressList = data as { FID: number; address: string }[];

  let successRequest = 0;
  let totalToFetch = Object.keys(addressList).length;
  const batchSize = 200;
  for (let i = 0; i < totalToFetch; i += batchSize) {
    const promiseList: Promise<any>[] = [];

    for (let j = i; j < i + batchSize; j++) {
      const { FID, address } = addressList[j];
      const params = {
        f: "json",
        singleLine: address,
        outFields: "Match_addr,Addr_type",
      };
      promiseList.push(
        axios
          .get(geocodingUrl, { params })
          .then((result) => {
            const coords = result.data["candidates"][0]["location"] as {
              x: number;
              y: number;
            };

            locationList.push({
              FID,
              address,
              coords: { lat: coords.y, lon: coords.x },
            });

            successRequest++;
          })
          .catch((error) => {
            console.error({
              status: error.response.status,
              data: error.response.data,
            });
          })
      );
    }

    await Promise.all(promiseList);
    logInfo("Get coord", `Retrieved ${i}/${totalToFetch}`);
  }

  logSuccess(
    "Fetching addresses's coord",
    `Successfully fetched ${successRequest}/${totalToFetch}`
  );

  const filePath = "./coord2.json";
  fs.writeFileSync(filePath, JSON.stringify(locationList));
  logSuccess(
    "Write file",
    `Successfully write to ${filePath} in ${Date.now() - startTime}ms`
  );
};

runGeocoding();
