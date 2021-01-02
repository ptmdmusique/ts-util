import { plainToClass } from "class-transformer";

const test = () => {
  class A {
    // @ts-ignore
    a: string;
    // constructor(a: string) {
    //   this.a = a;
    // }
    // constructor(a: A) {
    //   this.a = a.a;
    // }

    test() {
      console.log("ASD");
    }
  }

  const a = plainToClass(A, { a: "ZZZ" });
  // console.log();
  a.test();
};

test();
