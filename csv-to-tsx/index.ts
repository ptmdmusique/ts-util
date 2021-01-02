import csv from "csv-parser";
import fs from "fs";

const createTsFile = (
  extension: "tsx" | "ts" = "tsx",
  fileName: string = "result",
  data: object
) => {
  const outFileName = `${fileName}.${extension}`;
  console.info(`Writing to ${outFileName}`);

  fs.writeFile(
    outFileName,
    `export const data = ${JSON.stringify(data, null, 2)}`,
    (err) => {
      if (err) throw err;
      console.log("Saved!");
    }
  );
};

const transformStockSymbolCSV = () => {
  const result: Array<any> = [];
  fs.createReadStream("S&P500-Symbols.csv")
    .pipe(csv())
    .on("data", (data: any) => {
      result.push(data);
    })
    .on("end", () => {
      const outData: any[] = [];
      result.forEach(({ Symbol, Security }) => {
        outData.push({ Symbol, Security });
      });
      createTsFile("tsx", "test", outData);
    });
};
transformStockSymbolCSV();
