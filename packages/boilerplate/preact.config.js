const path = require('path')
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers when working with config.
 **/
export default function (config, env, helpers) {
  /** you can change config here **/
  // config.entry.home = path.resolve('./src/pages/home/app.js')
  // config.entry.bundle[0] = path.resolve('./src/pages/home/app.js')
  // console.log(config.module.loaders[0].options.plugins, 6666666)
  return config
  // console.log(path.resolve('./src/pages/home/app.js'), 6666666)
}