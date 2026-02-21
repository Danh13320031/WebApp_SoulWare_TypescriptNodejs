import fs from "fs";

const folderList = [
  {
    sourceDir: "views",
    targetDir: "dist/views",
  },
  {
    sourceDir: "public",
    targetDir: "dist/public",
  },
];

folderList.forEach((folder) => {
  fs.copy(folder.sourceDir, folder.targetDir, (err) => {
    if (err)
      console.error(`Sao chép thư mục ${folder.sourceDir} thất bại::: `, err);
    else console.log(`Sao chép thư mục ${folder.sourceDir} thành công!`);
  });
});
