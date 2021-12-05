import { validate, IsString, ValidateNested, IsBoolean } from "class-validator";

class boob {
  // @IsString()
  a: string;
  // @IsString()
  b: boolean;
  constructor(a: string, b: boolean) {
    this.a = a;
    this.b = b;
  }
}

const t = new boob("a", false);

const test = async () => {
  const result = await validate(t, { skipUndefinedProperties: false });
  console.log(result);
};

test();
