require('babel-register')({
  presets: ['env', 'react']
});

const chalk = require('chalk');
const {
  resolve
} = require('path');
const devSupportFiles = require('../devSupportFiles.json');
const fs = require('fs');

devSupportFiles.map(devSupportFile => {
  const {
    name,
    source,
    destination
  } = devSupportFile;
  const resolvedSource = resolve(source);
  const resolvedDestination = resolve(destination);
  if (fs.existsSync(resolvedDestination)) {
    fs.copyFileSync(resolvedDestination, resolvedSource);
    console.log(`${chalk.yellow.italic(name)} Dev Support File was successfully downloaded.`);
  } else {
    console.log(`${chalk.red.italic(`${chalk.red.bold(name)} Dev Support File was not found: ${chalk.magenta.bold(resolvedDestination)}`)}`);
  }
  return null;
});
