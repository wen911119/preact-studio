const gittar = require('gittar')
const inquirer = require('inquirer')

const path = require('path')
module.exports = async function (directory) {
  if (typeof directory !== 'string') {
    directory = (await inquirer.prompt([
      {
        type: 'input',
        name: 'directory',
        message: '请输入项目名称'
      }
    ])).directory
  }
  
  const archive = await gittar.fetch('wen911119/preact-toolkit')
  await gittar.extract(archive, path.resolve(process.cwd(), directory), {
    strip: 3,
    filter (path, obj) {
      if (path.includes('/preact-multi-page-template/')) {
        return true
      }
    }
  })
}
