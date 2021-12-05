import faker from "faker";
import fs from "fs";
import { v4 as uuiv4 } from "uuid";
import { generateRandomArray } from "../common/utils";

interface PriceCondition {
  type: "price";
  targetPrice: number;
}
type AlertCondition = PriceCondition;

interface Alert {
  alertId: string;
  isActive: boolean;
  targetCompany: string;
  conditionMap: AlertCondition[];
}

interface AlertDocSchema {
  numActiveAlert: number;
  alertList: Alert[];
}

const generatePriceCondition = (): PriceCondition => ({
  targetPrice: faker.random.number(),
  type: "price",
});

export const generateAlert = (): Alert => ({
  alertId: uuiv4(),
  isActive: faker.random.boolean(),
  targetCompany: faker.company.companyName(),
  conditionMap: generateRandomArray(generatePriceCondition, 50),
});

const test = () => {
  const alertList = generateRandomArray(generateAlert, 500);
  const numActiveAlert = alertList.reduce(
    (count, curAlert) => (count += curAlert.isActive ? 1 : 0),
    0
  );

  const alertDoc: Record<string, AlertDocSchema> = {
    [uuiv4()]: { alertList, numActiveAlert },
  };
  fs.writeFileSync("out.json", JSON.stringify(alertDoc));
};

test();
