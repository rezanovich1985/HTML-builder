const fs = require("fs");
const path = require("path");

const dirName = path.join(__dirname, "secret-folder");
fs.readdir(
  dirName,
  {
    withFileTypes: true,
  },
  (err, dirents) => {
    if (err) {
      console.log(err);
      return;
    }

    for (const dirent of dirents) {
      if (!dirent.isFile()) continue;

      const fileName = path.join(dirName, dirent.name);
      const parsedFileName = path.parse(fileName);
      fs.stat(fileName, (err, stats) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log(
          `${parsedFileName.name} - ${parsedFileName.ext.slice(1)} - ${
            Math.round((stats.size / 1024) * 1000) / 1000
          }kb`
        );
      });
    }
  }
);
