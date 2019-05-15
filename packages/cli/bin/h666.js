#!/usr/bin/env node
const program = require('commander')
const packageInfo = require('../package.json')
const options = require('minimist')(process.argv.slice(2))

program
  .version(packageInfo.version, '-v, --version')
  .allowUnknownOption()
  .description('h666-cli 工具')
  .usage('<command> [options]')

// add-page command
program
  .command('add-page')
  .description('新增页面')
  .action(() => {
    require('../libs/addPage')()
  })

// create new project command
program
  .command('create')
  .description('初始化一个新项目')
  .action(directory => {
    require('../libs/create')(directory)
  })

// start dev server
program
  .command('start')
  .option('-p, --port', 'dev server port, default 8080')
  .description('启动开发服务器')
  .action(port => {
    require('../libs/start')(port || 8080)
  })

// build command
program
  .command('build')
  .option('-t, --target', 'build for dev or production? default production')
  .description('打包最终代码')
  .action(target => {
    require('../libs/build')(target)
  })
program.parse(process.argv)

if (!options._.length) {
  program.help()
}
