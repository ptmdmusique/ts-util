import path from "path";
import fs from "fs";

export async function readFiles(baseDirName: string) {
  try {
    const dataFolderList = fs.readdirSync(baseDirName, { withFileTypes: true });

    // * Read all directories in the base directory
    dataFolderList.forEach(async (fileEnt) => {
      // This is to safe guard the case you accidentally put another file here
      if (fileEnt.isDirectory()) {
        const curFolderName = path.join(baseDirName, fileEnt.name);
        const dataFileList = fs.readdirSync(curFolderName);

        // * Read all files each detectorId folder
        dataFileList.forEach(async (fileName) => {
          // * Read the content and parse into JSON format
          const content = fs.readFileSync(
            path.join(curFolderName, fileName),
            "utf-8"
          );
          const jsonContent = JSON.parse(content);

          // ! I assume that detector main file doesn't have "-" in its name,
          // !  unlike the dailyData, that's why I use includes like this
          if (fileName.includes("-")) {
            // --- Add more of your logic here
            // * Daily data
            console.log("Got a dailyData", fileName);
          } else {
            // --- Add more of your logic here
            // * Main loopData
            console.log("Got a loopData", fileName);
          }
        });
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}
