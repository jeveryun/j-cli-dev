'use strict';

const path = require('path');

const Package = require('@j-cli-dev/package');
const log = require('@j-cli-dev/log');

const SETTINGS = {
  // init: '@j-cli-dev/init',
  init: '@imooc-cli/init',
};

const CATCH_DIR = 'dependencies';

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = '';
  let pkg;
  log.verbose('targetPath', targetPath);
  log.verbose('homePath', homePath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CATCH_DIR);
    storeDir = path.resolve(targetPath, 'node_modules');
    log.verbose('targetPath', targetPath);
    log.verbose('storeDir', storeDir);

    pkg = new Package({
      targetPath,
      packageName,
      storeDir,
      packageVersion,
    });
    if (await pkg.exists()) {
      // 更新package
      await pkg.update();
    } else {
      // 安装package
      await pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    });
  }
  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    // 在当前进程中调用
    require(rootFile).call(null, Array.from(arguments));
    // 在Node 子进程中调用
  }
}
module.exports = exec;
