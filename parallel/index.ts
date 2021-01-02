import faker from "faker";
import { generateRandomArray } from "../common/utils";
import { logInfo, logSuccess } from "../log/log";
import lodash from "lodash";

function asyncProcessing(arr: number[]) {
  return new Promise((resolve) => {
    resolve("ASD");
  });
}

async function forLoopInParallel(arr: number[]) {
  const promises: Promise<any>[] = [];
  const maxItemPerChunk = 2;

  const chunkList = lodash.chunk(arr, maxItemPerChunk);
  chunkList.forEach((chunk) => promises.push(asyncProcessing(chunk)));

  await Promise.all(promises);
}

function normalLoop(arr: number[]) {
  arr.forEach((num) => {
    const a = num ** 10 + num * 2 + num ** 2;
  });
}

const runTest = async () => {
  const testList = generateRandomArray(() => {
    return faker.random.number({ min: 0, max: 5 });
  }, 11);

  console.log("testList:", testList);
  logInfo("Start testing", `testing with ${testList.length} items`);

  let t1 = Date.now();
  normalLoop(testList);
  let t2 = Date.now();
  logSuccess("Normal loop", `${t2 - t1} milliseconds`);

  t1 = Date.now();
  await forLoopInParallel(testList);
  t2 = Date.now();
  logSuccess("For loop", `${t2 - t1} milliseconds`);
};

runTest();
