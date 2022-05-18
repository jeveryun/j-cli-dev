'use strict';

// now is 03.4-6

module.exports = core;

// require .js/.json/.node
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;

const log = require('@j-cli-dev/log');

const pkg = require('../package.json');
const constant = require('./const');

function core() {
  try {
    checkNodeVersion();
    checkPkgVersion();
    checkRoot();
    checkUserHome();
  } catch (error) {
    log.error(error.message);
  }
}

function checkUserHome() {
  console.log(userHome);
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
