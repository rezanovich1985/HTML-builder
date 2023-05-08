const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

async function mergeStyles(src, dest) {
  const output = fs.createWriteStream(dest);

  const files = await fsp.readdir(src);
  for (const file of files) {
    fileName = path.resolve(src, file);
    const stat = await fsp.stat(fileName);
    if (!stat.isFile() || path.extname(file) !== ".css") {
      continue;
    }

    fs.createReadStream(fileName).pipe(output, { end: false });
  }
}

mergeStyles(
  path.resolve(__dirname, "styles"),
  path.resolve(__dirname, "project-dist/bundle.css")
);

exports.mergeStyles = mergeStyles;
