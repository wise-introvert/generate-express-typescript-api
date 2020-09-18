#! /usr/bin/env node

const { spawn } = require("child_process");
const ora = require("ora");
const chalk = require("chalk");
const box = require("cli-box");

const cloneSpinner = ora("📋 Cloning API template");
const installSpinner = ora("📦 Installing dependencies");
const gitSpinner = ora("📂 Initializing GIT repository");

const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: create-express-api name-of-api  
`);
}

const repoURL =
  "https://www.github.com/wise-introvert/express-typescript-api.git";

cloneSpinner.start();
runCommand("git", ["clone", repoURL, name])
  .then(() => {
    cloneSpinner.succeed("API template successfully cloned.");
    cloneSpinner.stop();
    installSpinner.start();
    return runCommand("rm", ["-rf", `${name}/.git`]);
  })
  .then(() => {
    return runCommand("npm", ["install"], {
      cwd: process.cwd() + "/" + name
    });
  })
  .then(() => {
    installSpinner.succeed("Dependencies successfully installed.");
    installSpinner.stop();
    gitSpinner.start();
    return runCommand("git", ["init"], {
      cwd: process.cwd() + "/" + name
    });
  })
  .then(() => {
    return runCommand("git", ["add", "."], {
      cwd: process.cwd() + "/" + name
    });
  })
  .then(() => {
    return runCommand("git", ["commit", "-am", '"initial commit"'], {
      cwd: process.cwd() + "/" + name
    });
  })
  .then(() => {
    gitSpinner.succeed("Successfully initialized git repository.");
    gitSpinner.stop();
    console.log(
      box(
        "80x20",
        `\n🎉 Successfully created an express api using typescript.\n\n${chalk.whiteBright(
          "To get started, run the following commands:"
        )}\n${chalk.blue(`cd ${name}`)}\n${chalk.blue(
          "npm run start:watch"
        )}\n\n${chalk.whiteBright("Happy Hacking!")}`
      ).toString()
    );
  });

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise(resolve => {
    spawned.stdout.on("data", data => {
      // console.log("one: ", data.toString());
    });

    spawned.stderr.on("data", data => {
      // console.error("two: ", data.toString());
    });

    spawned.on("close", () => {
      resolve();
    });
  });
}
