import faker from "faker";
import { generateAlert } from "../alert";
import { generateRandomArray } from "../common/utils";
import { logError, logInfo, logWarning } from "../log/log";

const runTestSuite = (numAlert = 10000) => {
  // Original data list
  const alertList = generateRandomArray(generateAlert, numAlert);

  // Randomly pick out elements to remove from the list
  const removeIdList = alertList
    .filter(faker.random.boolean)
    .map((entry) => entry.alertId);

  // Append some more randomly generated IDs for stress test
  const numAddition = faker.random.number(numAlert * 0.8);
  for (let i = 0; i < numAddition; i++) {
    removeIdList.push(faker.random.uuid());
  }

  logInfo("Alert list", `${alertList.length} entries`);
  logInfo("Remove id list", `${removeIdList.length} entries`);

  // Naive algo
  const runNaiveAlgo = () => {
    // Non destructive action
    alertList.filter((entry) => !removeIdList.includes(entry.alertId));
  };

  // Naive algo
  const runMapAlgo = () => {
    const toRemoveMap: Record<string, boolean> = {};
    removeIdList.forEach((id) => (toRemoveMap[id] = true));

    // Non destructive action
    alertList.filter((entry) => !toRemoveMap[entry.alertId]);
    Object.entries(alertList);
    Object.entries(removeIdList);
  };

  let t0 = Date.now();
  runMapAlgo();
  let t1 = Date.now();
  logWarning("Map", `${t1 - t0} milliseconds`);

  t0 = Date.now();
  runNaiveAlgo();
  t1 = Date.now();
  logError("Naive", `${t1 - t0} milliseconds`);
};

const testAmountList = [10, 100, 1000, 5000, 10000, 50000, 100000];
for (let i = 0; i < testAmountList.length; i++) {
  runTestSuite(testAmountList[i]);
}
