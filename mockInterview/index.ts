/**
The string "PAYPALISHIRING" is written in a zigzag pattern on a
given number of rows like this: (you may want to display this
pattern in a fixed font for better legibility)

P   A   H   N
A P L S I I G
Y   I   R
And then read line by line: "PAHNAPLSIIGYIR"


Write the code that will take a string and make this conversion given a number of rows:

string convert(string s, int numRows);


Example 1:

Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"



Example 2:

Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:
P     I    N
A   L S  I G
Y A   H R
P     I
Example 3:

Input: s = "A", numRows = 1
Output: "A"


Constraints:

1 <= s.length <= 1000
s consists of English letters (lower-case and upper-case), ',' and '.'.
1 <= numRows <= 1000

*/

import { logSuccess } from "../log/log";

/*
P 0 0 I 0 0 N
A 0 L S 0 I G
Y A 0 H R 0 0
P 0 0 I 0 0 0
*/

const construct2dMatrix = (str: string, numRow: number): string[] => {
  const resultMatrix: string[] = [];
  for (let row = 0; row < Math.min(numRow, str.length); row++) {
    resultMatrix[row] = "";
  }

  let curRow = 0;
  let isGoingDown = false;
  for (let strIndex = 0; strIndex < str.length; strIndex++) {
    resultMatrix[curRow] += str[strIndex];
    if (curRow === 0 || curRow === numRow - 1) {
      isGoingDown = !isGoingDown;
    }
    curRow += isGoingDown ? 1 : -1;
  }

  return resultMatrix;
};

const convert = (str: string, numRow: number): string => {
  if (numRow === 1) {
    return str;
  }

  const resultMatrix = construct2dMatrix(str, numRow);

  let resultStr = "";
  for (const row of resultMatrix) {
    resultStr += row;
  }

  return resultStr;
};

const testStr = "PAYPALISHIRING";
const numRows = 3;

const runTest = (str: string, numRow: number) => {
  const t1 = Date.now();
  console.log(convert(str, numRow));
  const t2 = Date.now();

  logSuccess("Run time", `${t2 - t1}ms`);
};

runTest(testStr, numRows);
runTest(testStr, numRows + 1);

/*
P     I    N
A   L S  I G
Y A   H R
P     I
*/

// const calculateIndex = (flatIndex: number): number => {
//   return 0;
// };
// function convert(s: string, numRows: number): string {
//   if (numRows === 1) {
//     return s;
//   }

//   let resultStrList = [];
//   for (let i = 0; i < s.length; i++) {
//     resultStrList[calculateIndex(i)] = s[i];
//   }

//   return resultStrList.join();
// }

// const testStr2 = "PAYPALISHIRING";
// console.log(convert(testStr2, 3));
