require('babel-register')({
  presets: ['env', 'react']
});

const chalk = require('chalk');
const {
  resolve,
  join
} = require('path');
const fs = require('fs');
const devSupportFiles = require('../devSupportFiles.json');

devSupportFiles.map(devSupportFile => {
  const {
    name,
    source,
    destination
  } = devSupportFile;
  const resolvedSource = resolve(source);
  const resolvedDestination = destination.startsWith('~')
    ? join(process.env.HOME, destination.slice(1))
    : resolve(destination);
  if (fs.existsSync(resolvedSource)) {
    // console.log('resolved: ', JSON.stringify({
    //   resolvedSource,
    //   resolvedDestination
    // }, null, 2));
    fs.copyFileSync(resolvedSource, resolvedDestination);
    console.log(`${chalk.yellow.italic(name)} Dev Support File was successfully uploaded.`);
  } else {
    console.log(`${chalk.red.italic(`${chalk.red.bold(name)} Dev Support File was not found: ${chalk.magenta.bold(resolvedSource)}`)}`);
  }
  return null;
});
