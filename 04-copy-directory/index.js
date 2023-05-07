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
async function deleteDir(dirname) {
  try {
    await fsp.access(dirname);
  } catch {
    return;
  }

  const files = await fsp.readdir(dirname);
  for (const file of files) {
    const fileName = path.resolve(dirname, file);
    await deleteFile(fileName);
  }

  await fsp.rmdir(dirname);
}
async function deleteFile(fileName) {
  const stat = await fsp.stat(fileName);
  if (stat.isFile()) {
    fsp.unlink(fileName);
  } else if (stat.isDirectory()) {
    deleteDir(fileName);
  }
}

copyDir(
  path.resolve(__dirname, "files"),
  path.resolve(__dirname, "files-copy")
);
