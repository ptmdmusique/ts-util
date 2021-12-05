import chalk, { Chalk } from "chalk";

export const logWarning = (type: string, message: string | object) => {
  logHelper("Warning", type, message, chalk.yellow, console.warn);
};
export const logInfo = (type: string, message: string | object) => {
  logHelper("Info", type, message, chalk.blue, console.info);
};
export const logError = (type: string, message: string | object) => {
  logHelper("Error", type, message, chalk.red, console.error);
};

export const logSuccess = (type: string, message: string | object) => {
  logHelper("Success", type, message, chalk.green, console.error);
};

const logHelper = (
  level: string,
  type: string,
  message: string | object,
  chalkColor: Chalk,
  logger: (...arg: any[]) => void = console.info
) => {
  const prefix = chalkColor(`[${level}]`);
  const timeStr = `- ${new Date().toISOString()}`;
  const messageStr = `- ${chalkColor("Message:")} ${message}`;
  const typeStr = `- ${chalkColor("Type:")} ${type}`;
  logger(`${prefix} ${timeStr} ${typeStr} ${messageStr}`);
};
