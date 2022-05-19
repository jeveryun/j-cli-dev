'use strict';

// now is 03.4-8

// require .js/.json/.node

const path = require('path');

const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;

const log = require('@j-cli-dev/log');

const pkg = require('../package.json');
const constant = require('./const');
let args;
let config;

module.exports = core;

async function core() {
  try {
    checkNodeVersion();
    checkPkgVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
    checkGlobalUpdate();
  } catch (error) {
    log.error(error.message);
  }
}

async function checkGlobalUpdate() {
  // 获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 通过npm api 拿到模块名所有版本号
  const { getNpmInfo } = require('@j-cli-dev/get-npm-info');
  const data = await getNpmInfo(npmName);
  console.log(data);
  // 提取所有版本号，比对哪些版本号是大于当前版本号的
  // 获取最新版本号
}

function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  config = createDefaultConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

function checkInputArgs() {
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red(`当前登录用户主目录不存在！`));
  }
}

function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck();
}

function checkNodeVersion() {
  const currentVersion = process.version;
  const lowerVersion = constant.LOWEST_NODE_VERSION;
  if (semver.gt(lowerVersion, currentVersion)) {
    throw new Error(
      colors.red(`j-cli 需要安装 v${lowerVersion} 以上的 Node.js 版本!`)
    );
  }
}

function checkPkgVersion() {
  log.notice('cli', pkg.version);
}
