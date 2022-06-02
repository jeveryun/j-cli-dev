'use strict';

function init(projectName, options, command) {
  const opts = command.parent.opts();
  console.log('init', projectName, options.force, process.env.CLI_TARGET_PATH);
}

module.exports = init;
