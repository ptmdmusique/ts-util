import { readdirSync, readFileSync, writeFileSync } from "fs";

interface BaseColor {
  name: string;
  colorGroup: string;
  hexValue: string;
}

interface BaseNail {
  name: string;
}
interface NailColor extends BaseNail {
  colorGroup: string;
  /** RGB */
  color: [number, number, number];
  sku: string | null;
}

interface NailPattern extends BaseNail {
  imageUrl: string;
}

const colorGroupList = [
  "Black",
  "Brown",
  "Blue",
  "Purple",
  "Red",
  "Green",
  "Nude",
  "Metallic",
  "Yellow",
  "Pink",
  "Orange",
  "White",
] as const;

type CollectionName = typeof colorGroupList[number] | "Patterns";

// const colorGroupImageMap: Record<ColorGroup, string> = {
//   Black:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Blue: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Brown:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Green:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Metallic:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Nude: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Orange:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Pink: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Purple:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Red: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   White:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
//   Yellow:
//     "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.max-1000x1000.png",
// };

interface ColorCollection {
  name: CollectionName;
  thumbnailUrl: string;
  colors: (NailColor | NailPattern)[];
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

const getThumbnailUrl = (groupName: string) =>
  `https://storage.googleapis.com/color-collection-thumbnail/${groupName}.jpg`;

const getPatternUrl = (patternName: string) =>
  `https://storage.googleapis.com/pattern-collection-bucket/${patternName}.jpg`;

const getColorDataList = (baseColorList: BaseColor[]): NailColor[] =>
  baseColorList.map((info) => {
    const colorGroup = info.colorGroup;
    if (!colorGroup) {
      console.log("Missing color group", info);
    } else if (colorGroup.split("/").length > 1) {
      // console.log("Odd color group", colorGroup);
    }

    return {
      name: info.name,
      sku: null, // TODO: Change this
      color: hexToRgb(info.hexValue) || [0, 0, 0],
      colorGroup: getColorGroup(colorGroup || "Nude"),
      image: null,
    };
  });

const start = async () => {
  const colorMap: Record<string, BaseColor> = {};

  // * --- Color patterns
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

  const outputData: Record<string, ColorCollection> = {};
  transformedData.forEach((color) => {
    const colorGroup = color.colorGroup;

    if (!outputData[colorGroup]) {
      outputData[colorGroup] = {
        name: colorGroup as CollectionName,
        thumbnailUrl: getThumbnailUrl(colorGroup.toLocaleLowerCase()),
        colors: [color],
      };
    } else {
      outputData[colorGroup].colors.push(color);
    }
  });

  const finalData = Object.values(outputData)
    .sort((a, b) => (a.name === "Red" ? -1 : a.name.localeCompare(b.name)))
    .map((colorCollection) => {
      return {
        ...colorCollection,
        colors: colorCollection.colors.sort((a, b) =>
          a.name === "Big Apple Red" ? -1 : a.name.localeCompare(b.name),
        ),
      };
    });

  // * --- Patterns
  const patternsList: NailPattern[] = readdirSync("./nail-patterns").map(
    (fileName) => {
      const patternName = fileName.split(".").shift() || "";
      const capitalizedName = patternName
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");

      return { name: capitalizedName, imageUrl: getPatternUrl(patternName) };
    },
  );

  finalData.push({
    name: "Patterns",
    thumbnailUrl: getThumbnailUrl("pattern"),
    colors: patternsList,
  });

  writeFileSync(
    "./output.js",
    `export const nailColorData = ${JSON.stringify(finalData)};`,
  );
};

start();
