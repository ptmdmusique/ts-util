import fs from "fs";
import * as data from "./supported-symbol-list-data.json";

interface StockData {
  symbol: string;
  exchange: string;
  exchangeSuffix: string;
  exchangeName: string;
  name: string;
  date: string;
  type: string;
  iexId: string;
  region: string;
  currency: string;
  isEnabled: boolean;
  figi: string;
  cik: string;
  lei: string;
}

// @ts-ignore
const dataList = data.default as StockData[];

const cleanedData = dataList.map((entry) => ({
  symbol: entry.symbol,
  name: entry.name,
  isEnabled: entry.isEnabled,
}));

const symbolList = dataList.map((entry) => entry.symbol);

const outData = `export const iexSupportList=${JSON.stringify(cleanedData)}`;
fs.writeFileSync("./supported-symbol-list.ts", outData);

const symbolListStr = `export const symbolList=${JSON.stringify(symbolList)}`;
fs.writeFileSync("./symbol-list.ts", symbolListStr);

const symbolTypeMap: Record<string, { type: string }> = {};
dataList.forEach((entry) => {
  symbolTypeMap[entry.symbol] = { type: entry.type };
});

const symbolTypeMapStr = `export const symbolTypeMap=${JSON.stringify(
  symbolTypeMap
)}`;
fs.writeFileSync("./symbol-type-map.ts", symbolTypeMapStr);

const specialSymbolListStr = `export const specialSymbolList=${JSON.stringify(
  dataList
    .filter((entry) =>
      [
        "et",
        "ps",
        "ad",
        "cef",
        "oef",
        "rt",
        "struct",
        "ut",
        "wi",
        "wt",
        null,
      ].includes(entry.type)
    )
    .map((entry) => entry.symbol)
)}`;
fs.writeFileSync("./special-symbol-list.ts", specialSymbolListStr);
