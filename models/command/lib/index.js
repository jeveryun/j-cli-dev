'use strict';
const semver = require('semver');
const colors = require('colors');
const LOWEST_NODE_VERSION = '19.0.0';
class Command {
  constructor(argv) {
    // console.log('command constructor', argv);
    this._argv = argv;

    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
    });
  }

  checkNodeVersion() {
    const currentVersion = process.version;
    const lowerVersion = LOWEST_NODE_VERSION;
    if (semver.gt(lowerVersion, currentVersion)) {
      throw new Error(
        colors.red(`j-cli 需要安装 v${lowerVersion} 以上的 Node.js 版本!`)
      );
    }
  }

  init() {
    throw new Error('init 必须实现');
  }
  exec() {
    throw new Error('exec 必须实现');
  }
}

module.exports = Command;
