const fs = require("fs");
const path = require("path");

const { stdin, stdout } = process;
const output = fs.createWriteStream(path.join(__dirname, "text.txt"));

stdout.write("Hello! Enter text:\n");
stdin.on("data", (data) => {
  const dataStringified = data.toString();
  if (dataStringified.trimEnd() === "exit") {
    process.exit();
  } else {
    output.write(data);
  }
});

process.on("exit", () => {
  stdout.write("Goodbye!");
});
process.on("SIGINT", () => {
  process.exit();
});
