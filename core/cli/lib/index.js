'use strict';

// now is 03.4-9

// require .js/.json/.node

const path = require('path');

const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const commander = require('commander');

const log = require('@j-cli-dev/log');
const init = require('@j-cli-dev/init');

const pkg = require('../package.json');
const constant = require('./const');
let args;
let config;

module.exports = core;

const program = new commander.Command();

async function core() {
  try {
    await prepare();
    registerCommand();
  } catch (error) {
    log.error(error.message);
  }
}

function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(init);

  program.on('option:debug', function () {
    const opts = program.opts();
    if (opts.debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
    // log.verbose('test');
  });

  // 指定targetPath
  program.on('option:targetPath', function () {
    const opts = program.opts();
    process.env.CLI_TARGET_PATH = opts.targetPath;
  });

  program.on('command:*', function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    console.log(colors.red('未知的命令:' + obj[0]));
    if (availableCommands.length > 0) {
      console.log(colors.red('可用命令:' + availableCommands.join(',')));
    }
  });

  program.parse(process.argv);
}

async function prepare() {
  checkPkgVersion();
  checkNodeVersion();
  checkRoot();
  checkUserHome();
  checkEnv();
  await checkGlobalUpdate();
}

async function checkGlobalUpdate() {
  // 获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 通过npm api 拿到模块名所有版本号
  const { getNpmSemverVersion } = require('@j-cli-dev/get-npm-info');
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      colors.yellow(
        '更新提示',
        `请手动更新 ${npmName}, 当前版本： ${currentVersion}, 最新版本： ${lastVersion}
            更新命令： npm install -g ${npmName}`
      )
    );
  }
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
