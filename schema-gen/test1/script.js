const fs = require("fs");

module.exports.testChoi = (fileName, schemaName, jsonObj) => {
  const outFileName = `${fileName}.validator.ts`;
  const validatorInterface = `${schemaName}Validator`;
  console.info(`Writing ${validatorInterface} to ${outFileName}`);

  fs.writeFile(
    outFileName,
    `export const ${validatorInterface} = ${JSON.stringify(jsonObj, null, 2)}`,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
};
