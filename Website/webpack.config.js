const path = require('path');
const UnusedWebpackPlugin = require('unused-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    plugins: [
      ...otherPlugins,
      new UnusedWebpackPlugin({
        directories: [path.join(__dirname, 'src')],
        exclude: ['*.test.js'],
        root: __dirname,
      }),
    ]
  }
};
