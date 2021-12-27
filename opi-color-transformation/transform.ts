import { readdirSync, readFileSync, writeFileSync } from "fs";

interface BaseColor {
  name: string;
  colorGroup: string;
  hexValue: string;
}

interface NailColor {
  name: string;
  colorGroup: string;
  /** RGB */
  color: [number, number, number];
  sku: string;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

const getColorGroup = (baseColorGroup: string) => {
  switch (baseColorGroup) {
    case "Nudes/Neutrals":
      return "Nude";
    case "Blacks/Whites/Grays":
      return "Black";
    default:
      return baseColorGroup;
  }
};

const getColorDataList = (baseColorList: BaseColor[]): NailColor[] =>
  baseColorList.map((info) => {
    const colorGroup = info.colorGroup;
    if (!colorGroup) {
      console.log("Missing color group", info);
    } else if (colorGroup.split("/").length > 1) {
      console.log("Odd color group", colorGroup);
    }

    return {
      name: info.name,
      sku: "unknown", // TODO: Change this
      color: hexToRgb(info.hexValue) || [0, 0, 0],
      colorGroup: getColorGroup(colorGroup || "Nude"),
    };
  });

const start = async () => {
  const colorMap: Record<string, BaseColor> = {};

  readdirSync("./").forEach((file) => {
    const extension = file.split(".").pop();
    if (extension === "json") {
      const colorList = JSON.parse(
        readFileSync(file).toString(),
      ) as BaseColor[];

      colorList.forEach((color) => {
        colorMap[color.name] = color;
      });
    }
  });

  const transformedData = getColorDataList(Object.values(colorMap));

  writeFileSync(
    "./output.js",
    `export const nailColorData = ${JSON.stringify(transformedData)};`,
  );
};

start();
