const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

async function copyDir(src, dest) {
  await deleteDir(dest);
  await fsp.mkdir(dest, { recursive: true });

  const files = await fsp.readdir(src);
  files.forEach((file) => {
    const fileNameSrc = path.resolve(src, file);
    const fileNameDest = path.resolve(dest, file);
    copyFile(fileNameSrc, fileNameDest);
  });
}
async function copyFile(fileNameSrc, fileNameDest) {
  const stat = await fsp.stat(fileNameSrc);
  if (stat.isFile()) {
    fsp.copyFile(fileNameSrc, fileNameDest);
  } else if (stat.isDirectory()) {
    await fsp.mkdir(fileNameDest, { recursive: true });
    copyDir(fileNameSrc, fileNameDest);
  }
}
async function deleteDir(dirName) {
  try {
    await fsp.access(dirName);
  } catch {
    return;
  }

  const files = await fsp.readdir(dirName);
  for (const file of files) {
    const fileName = path.resolve(dirName, file);
    await deleteFile(fileName);
  }

  //await fsp.rmdir(dirName);
}
async function deleteFile(fileName) {
  const stat = await fsp.stat(fileName);
  if (stat.isFile()) {
    await fsp.unlink(fileName);
  } else if (stat.isDirectory()) {
    await deleteDir(fileName);
  }
}

copyDir(
  path.resolve(__dirname, "files"),
  path.resolve(__dirname, "files-copy")
);

exports.copyDir = copyDir;
