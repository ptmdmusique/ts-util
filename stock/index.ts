import dayjs from "dayjs";

const testStr = "GOOGL Jun 19 2020 98.0 Call";

const splitTDAmOptionInfoFromName = (
  name: string
): {
  ticker: string;
  expirationDate: string;
  strikePrice: number;
  type: "call" | "put";
} => {
  const splittedName = name.split(" ");

  return {
    ticker: splittedName[0],
    strikePrice: parseFloat(splittedName[splittedName.length - 2]),
    type: splittedName[splittedName.length - 1].toLowerCase() as "call" | "put",
    expirationDate: dayjs(
      splittedName.slice(1, 4).join(" "),
      "MMM DD YYYY"
    ).toISOString(),
  };
};
console.log(splitTDAmOptionInfoFromName(testStr));
