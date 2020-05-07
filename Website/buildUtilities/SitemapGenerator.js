require('babel-register')({
  presets: ['env', 'react']
});

const chalk = require('chalk');
const envName = process.env.REACT_APP_ENV_NAME;
const baseURL = process.env.REACT_APP_WEB_BASE_URL;
const {
  resolve
} = require('path');

if (!envName) {
  console.error(chalk.red.bold(`'REACT_APP_ENV_NAME' is '${chalk.gray.italic('undefined')}'`));
}
if (!baseURL) {
  console.error(chalk.red.bold(`'REACT_APP_WEB_BASE_URL' for '${envName}' is '${chalk.gray.italic('undefined')}'`));
} else {
  const SitemapRoutes = require('./SitemapRoutes').default;
  const Sitemap = require('react-router-sitemap').default;
  // console.log(`SitemapRoutes: ${JSON.stringify(SitemapRoutes, null, 2)}`);
  const siteMapFullFilePath = resolve('./public/sitemap.xml');
  // console.log(`siteMapFullFilePath: ${siteMapFullFilePath}`);
  new Sitemap(SitemapRoutes)
    .build(baseURL)
    .save(siteMapFullFilePath);
  console.log(chalk.green.bold(`New sitemap for '${chalk.blue.italic(envName)}': ${chalk.yellow.italic(baseURL)}`));
}