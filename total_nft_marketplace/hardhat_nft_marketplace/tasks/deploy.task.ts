import fs from "node:fs";
import path from "node:path";
import { task } from "hardhat/config";
import { spawn } from "child_process";

task(
  "deploy",
  "Deploy all the contract scripts inside ignition/module directory"
).setAction(async function (args, hre) {
  const files = fs.readdirSync(path.join(__dirname, "../ignition/modules"));
  files.sort();
  console.log("Deploying contracts 🚀");
  const command = "npx";
  files.forEach((file) => {
    console.log(file);
    const args = [
      "hardhat",
      "ignition",
      "deploy",
      `./ignition/modules/${file}`,
      "--network",
      "ganache",
    ];

    const subprocess = spawn(command, args);
    subprocess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    subprocess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
    subprocess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
});
