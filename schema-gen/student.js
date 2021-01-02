"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ajv_1 = __importDefault(require("ajv"));
var studentSchema = {
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
    var ajv = new ajv_1.default();
    var isValid = ajv.validate(studentSchema, {
        // id: "asd",
        isMale: false,
        age: 22,
        name: "asd",
    });
    console.log(isValid);
}
main();
