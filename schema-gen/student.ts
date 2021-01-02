import Ajv from "ajv";

const studentSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  properties: {
    age: {
      type: "number",
    },
    id: {
      type: "string",
    },
    isMale: {
      type: "boolean",
    },
    name: {
      type: "string",
    },
  },
  required: ["age", "isMale", "name"],
  type: "object",
};

function main() {
  const ajv = new Ajv();
  const isValid = ajv.validate(studentSchema, {
    // id: "asd",
    isMale: false,
    age: 22,
    name: "asd",
  });

  console.log(isValid);
}

main();
