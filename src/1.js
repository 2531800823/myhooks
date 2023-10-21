import fs from "fs";

function countDirectories() {
  fs.readdir(".//src", { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    let count = 0;
    for (const file of files) {
      if (file.isDirectory()) {
        count++;
      }
    }

    console.log(`当前文件夹数量：${count}`);
  });
}

// 读取当前的文件夹数量
countDirectories();
