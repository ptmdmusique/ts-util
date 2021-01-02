const fs = require("fs");

function replaceStringFromFile(filePath, searchValue, replaceValue) {
  const buffer = fs.readFileSync(filePath);
  let newFileStr = buffer.toString();

  newFileStr = newFileStr.replace(searchValue, replaceValue);

  fs.writeFileSync(filePath, newFileStr);
}

// thay vì flow vầy
// hiện giờ: script gen -> tạo json -> đọc json trong JS -> chuyen63 thành TS phải ko?
// script gen => tạo ts thằng nào làm cái này => sửa file ts dc tạo cho chuẩn
// à tiếp đi

// trong 1 script bash:
/*
  gen schema (ko tạo file) => pipe vào JS => JS thêm export const myJSON = vào đầu => JS viết ra file // cai nay on hon
*/
// mà ko rõ cái nào ngon hơn

module.exports.testChoi = (arg) => {
  // replaceStringFromFile(
  //   "./abc.ts",
  //   /ducthongminh/g,
  //   `export const myJson = 'ducNGU'`
  // );
  console.log(arg);

  // hoi trc chua biet lam ao lay' dc cai' json ra tu` bash phai ko dc r
  fs.writeFile(
    "mynewfile1.ts",
    `export const myJson = "${arg}"}`,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
};
// testChoi();
