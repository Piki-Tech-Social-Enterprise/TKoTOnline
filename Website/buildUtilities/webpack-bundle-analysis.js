process.env.NODE_ENV = 'production';
// const path = require('path');
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
// const UnusedWebpackPlugin = require('unused-webpack-plugin');
const bundleAnalyzerPluginOptions = {
  analyzerMode: 'static',
  reportFilename: 'report.html',
};
const bundleAnalyzerPlugin = new BundleAnalyzerPlugin(bundleAnalyzerPluginOptions);
// const unusedWebpackPluginOptions = {
//   directories: [path.join(__dirname, 'src')],
//   exclude: ['*.test.js'],
//   root: __dirname,
// };
// const unusedWebpackPlugin = new UnusedWebpackPlugin(unusedWebpackPluginOptions);
const WebpackConfig = require('react-scripts/config/webpack.config');
const webpackConfig = new WebpackConfig(process.env.NODE_ENV);
const {
  promisify
} = require('util');
const {
  exec
} = require('child_process');
const execAsync = promisify(exec);
const execOptions = {
  cwd: './'
};
const callExecAsync = async (command, execOptions) => {
  console.log(`Calling ${JSON.stringify({
    command,
    execOptions
  }, null, 2)}`);
  const {
    err,
    stdout,
    stderr
  } = await execAsync(command, execOptions);
  if (err) {
    console.error(`err: ${err}`)
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
};
const scriptName = process.argv[2];
const webpack = require('webpack');
// console.log('process.argv: ', JSON.stringify(process.argv, null, 2));
// console.log(JSON.stringify({
//   bundleAnalyzerPluginOptions,
//   bundleAnalyzerPlugin,
//   webpackConfig
// }, null, 2));

webpackConfig.plugins.push(bundleAnalyzerPlugin);
// webpackConfig.plugins.push(unusedWebpackPlugin);
// callExecAsync('ls', execOptions);
if (scriptName && scriptName.length) {
  callExecAsync(`npm run "${scriptName}"`, execOptions);
}
webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err);
  }
});
