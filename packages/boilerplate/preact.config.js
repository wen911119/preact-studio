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
  if (env.isProd) {   

    // Make async work
    let babel = config.module.loaders.filter( loader => loader.loader === 'babel-loader')[0].options;
    // Blacklist regenerator within env preset:
    babel.presets[0][1].exclude.push('transform-async-to-generator');
    // Add fast-async
    babel.plugins.push([require.resolve('fast-async'), { spec: true }]);
  }
  // console.log(path.resolve('./src/pages/home/app.js'), 6666666)
}