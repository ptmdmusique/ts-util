import { open } from "shapefile";
import { FeatureCollection } from "geojson";
import fs from "fs";

open("data/b2h_route.shp")
  .then(async (source) => {
    const output: FeatureCollection & { crs: any } = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "EPSG:4326" } },
      features: [],
    };

    let result = await source.read();
    for (; result.done === false; result = await source.read()) {
      output.features.push(result.value);
    }

    fs.writeFileSync("out.geojson", JSON.stringify(output));
  })
  .catch((error) => console.error(error.stack));
