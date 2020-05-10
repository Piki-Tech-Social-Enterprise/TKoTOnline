require('babel-register')({
  presets: ['env', 'react']
});

const chalk = require('chalk');
const {
  resolve
} = require('path');
const action = {
  unset: 'unset',
  set: 'set',
  undefined: 'undefined'
};
// const actionParameter = ((process.argv && process.argv.length && process.argv[0] === action.unset) || action.undefined);
const actionParameter = (process.argv && process.argv.length && process.argv[2])
  ? process.argv[2].toString() === action.set
    ? action.set
    : action.unset
  : action.undefined;
console.log(`process.argv: ${process.argv}, process.argv[2]: ${process.argv && process.argv.length && process.argv[2]}, actionParameter: ${actionParameter}`);
const envName = process.env.REACT_APP_ENV_NAME;
const envCmdFileName = resolve('../.env-cmdrc');
const fs = require('fs');
const {
  exec
} = require('child_process');

if (actionParameter === action.undefined) {
  console.error(chalk.red.bold(`'actionParameter' is '${chalk.gray.italic('undefined')}'`));
} else if (!envName) {
  console.error(chalk.red.bold(`'REACT_APP_ENV_NAME' is '${chalk.gray.italic('undefined')}'`));
}
if (!fs.existsSync(envCmdFileName)) {
  console.error(chalk.red.bold(`'.env-cmdrc' for '${envName}' missing at '${chalk.gray.italic(envCmdFileName)}'`));
} else {
  console.log(`${actionParameter.toUpperCase()} env. variables for '${envName}'`);
  console.log(`Processing file: ${envCmdFileName}`);

  fs.readFile(envCmdFileName, (error, content) => {
    if (error) {
      throw error;
    }
    const envCmdFileAsJson = JSON.parse(content);
    const currentEnv = envCmdFileAsJson[envName];
    const keyValuePairs = [];

    Object.keys(currentEnv).map(key => (
      key && key.startsWith('REACT')
        ? keyValuePairs.push(`envcmd.${key.toLowerCase()}="${currentEnv[key]}"`)
        : null
    ));

    const command = `firebase functions:config:${actionParameter} ${keyValuePairs.join(' ')}`;
    const options = {
      cwd: '../'
    };

    console.log(`command: ${command}`);
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`error: ${chalk.bold(JSON.stringify(error, null, 2))}`));
        return;
      }
      if (stderr) {
        console.log(chalk.red(`stderr: ${chalk.bold(stderr)}`));
        return;
      }
      console.log(chalk.green(`stdout: ${chalk.bold(stdout)}`));
    });
  });
}