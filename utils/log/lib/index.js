'use strict';

const log = require('npmlog');

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'; // 判断debug 模式
log.heading = 'jever';
// log.headingStyle = { fg: 'red', bg: 'black' };
log.addLevel('success', 2000, { fg: 'green', bold: true }); //添加自定义命名

module.exports = log;
