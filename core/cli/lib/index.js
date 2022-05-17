'use strict';

// now is 03.4-3

module.exports = core;

// require .js/.json/.node
const pkg = require('../package.json');
const log = require('@j-cli-dev/log');

function core() {
  checkPkgVersion();
}

function checkPkgVersion() {
  log.notice('cli', pkg.version);
}
