require('babel-register')({
  presets: ['env', 'react']
});

const chalk = require('chalk');
const {
  resolve
} = require('path');
const envName = process.env.REACT_APP_ENV_NAME;
const buildVersion = process.env.REACT_APP_PWA_BUILD_VERSION;
const envCmdFileName = resolve('./.env-cmdrc');
const fs = require('fs');

if (!envName) {
  console.error(chalk.red.bold(`'REACT_APP_ENV_NAME' is '${chalk.gray.italic('undefined')}'`));
}
if (!buildVersion) {
  console.error(chalk.red.bold(`'REACT_APP_PWA_BUILD_VERSION' for '${envName}' is '${chalk.gray.italic('undefined')}'`));
} else if (!fs.existsSync(envCmdFileName)) {
  console.error(chalk.red.bold(`'.env-cmdrc' for '${envName}' missing at '${chalk.gray.italic(envCmdFileName)}'`));
} else {
  console.log(`Old build version for '${envName}': ${buildVersion}`);
  console.log(`Processing file: ${envCmdFileName}`);

  fs.readFile(envCmdFileName, (error, content) => {
    if (error) {
      throw error;
    }
    const envCmdFileAsJson = JSON.parse(content);
    const currentEnv = envCmdFileAsJson[envName];
    const [
      majorVersion,
      minorVersion,
      patchVersion
    ] = buildVersion.split('.');
    const incrementedBuildVersion = `${majorVersion}.${minorVersion}.${parseInt(patchVersion || -1) + 1}`;

    currentEnv.REACT_APP_PWA_BUILD_VERSION = incrementedBuildVersion;

    const envCmdFileAsString = JSON.stringify(envCmdFileAsJson, null, '  ');
    fs.writeFile(envCmdFileName, envCmdFileAsString, error => {
      if (error) {
        throw error;
      }
      console.log(chalk.green.bold(`New build version for '${chalk.blue.italic(envName)}': ${chalk.yellow.italic(envCmdFileAsJson[envName].REACT_APP_PWA_BUILD_VERSION)}`));
    });
  });
}