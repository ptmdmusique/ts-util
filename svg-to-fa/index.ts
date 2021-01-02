import fs from "fs";
import lodash from "lodash";

// import * as data from "./icon_json/set.json";
import * as data from "./icon_json/SW_Icon_Set.json";

const writeTSFileFromJSON = () => {
  // FA info
  const setPrefix = "ci"; // custom icon
  // const { width, height } = data.metadata.importSize;
  const width = 900;
  const height = 900;
  const ligatures: string[] = [];
  const unicode = "";

  // Extract and write to file
  let resultStr = "";

  const iconList = data.icons;
  iconList.forEach((icon) => {
    const rawIconName = icon.tags[0];
    const splittedName = rawIconName.split("-");
    const iconType = splittedName.pop();

    const iconName = splittedName.join("-");

    let prefix = setPrefix + "o"; // custom icon outline
    switch (iconType) {
      case "outlined":
        prefix = setPrefix + "o";
        break;
      case "solid":
        prefix = setPrefix + "s";
        break;
    }
    const pathList = icon.paths;

    const objName = lodash.camelCase(rawIconName);
    const iconObj = {
      prefix,
      iconName,
      icon: [width, height, ligatures, unicode, pathList],
    };

    resultStr += `export const ${objName} = ${JSON.stringify(iconObj)};\n`;
  });

  fs.writeFile("./customIconList.tsx", resultStr, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
};

const listFromRegex = (
  originalStr: string,
  eleRegex: RegExp,
  attrRegex: RegExp,
  redundantRegex: RegExp
) =>
  originalStr
    .match(eleRegex)
    ?.map(
      (path) =>
        path.match(attrRegex)?.map((d) => d.replace(redundantRegex, ""))[0]
    );

// ! Unfinished! Cases left: rectangle, etc
const writeTSFileFromSVG = () => {
  const setPrefix = "ci"; // custom icon
  const ligatures: string[] = [];
  const unicode = "";

  // * Viewbox
  const viewBoxRegex = /viewBox="(.*?)"/g;
  const redundantViewBoxRegex = /viewBox=|"/g;

  // * Path
  const pathRegex = /<path\b([\s\S]*?)\/>/g;
  const dRegex = / d="(.*?)"/g;
  const redundantPathRegex = /\sd=|"/g;

  // * Polygon
  const polygonRegex = /<polygon\b([\s\S]*?)\/>/g;
  const pointRegex = / points="(.*?)"/g;
  const redundantPointRegex = /\spoints=|"/g;

  const fileNameList = fs.readdirSync("./icons");

  let resultStr = "";
  fileNameList.forEach((fileName) => {
    const result = fs.readFileSync(`./icons/${fileName}`, "utf-8");
    const rawIconName = fileName;
    const splittedName = rawIconName.split("-");
    const iconType = splittedName.pop();
    const iconName = splittedName.join("-");

    let prefix = setPrefix + "o"; // custom icon outline
    switch (iconType) {
      case "outlined":
        prefix = setPrefix + "o";
        break;
      case "solid":
        prefix = setPrefix + "s";
        break;
    }

    const viewBoxSpec = result
      .match(viewBoxRegex)?.[0]
      .replace(redundantViewBoxRegex, "")
      .split(" ");
    const width = parseFloat(viewBoxSpec?.[2] || "0");
    const height = parseFloat(viewBoxSpec?.[3] || "0");

    const pathList = listFromRegex(
      result,
      pathRegex,
      dRegex,
      redundantPathRegex
    );
    const pointList = listFromRegex(
      result,
      polygonRegex,
      pointRegex,
      redundantPointRegex
    )?.map((point) => `M${point}z`);

    const finalList = ([] as (string | undefined)[])
      .concat(pathList, pointList)
      .filter((ele) => ele != null);

    const objName = lodash.camelCase(rawIconName);
    const iconObj = {
      prefix,
      iconName,
      icon: [width, height, ligatures, unicode, finalList],
    };

    resultStr += `export const ${objName} = ${JSON.stringify(iconObj)};\n`;
  });

  fs.writeFile("./customIconList2.tsx", resultStr, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
};

// writeTSFileFromSVG();
writeTSFileFromJSON();
