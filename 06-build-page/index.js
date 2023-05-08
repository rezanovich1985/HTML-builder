const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const { mergeStyles } = require("../05-merge-styles/index.js");
const { copyDir } = require("../04-copy-directory/index.js");

(async () => {
  const dirNameDest = path.resolve(__dirname, "project-dist");
  await fsp.mkdir(dirNameDest, { recursive: true });

  const components = {};
  const dirNameComponents = path.resolve(__dirname, "components");
  const files = await fsp.readdir(dirNameComponents);
  for (const file of files) {
    const fileName = path.resolve(dirNameComponents, file);
    const stat = await fsp.stat(fileName);
    if (!stat.isFile()) {
      continue;
    }

    const parsedFileName = path.parse(fileName);
    components[parsedFileName.name] = await fsp.readFile(fileName, {
      encoding: "utf8",
    });
  }

  const fileNameTemplate = path.resolve(__dirname, "template.html");
  const template = await fsp.readFile(fileNameTemplate, {
    encoding: "utf8",
  });

  let index = template;
  for (const key in components) {
    index = index.replaceAll(`{{${key}}}`, components[key]);
  }

  const fileNameIndex = path.resolve(dirNameDest, "index.html");
  await fsp.writeFile(fileNameIndex, index);

  mergeStyles(
    path.resolve(__dirname, "styles"),
    path.resolve(__dirname, "project-dist/style.css")
  );
  copyDir(
    path.resolve(__dirname, "assets"),
    path.resolve(dirNameDest, "assets")
  );
})();
