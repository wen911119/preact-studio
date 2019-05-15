const path = require('path')
const webpack = require('webpack')
const {
  readdirSync,
  existsSync,
  createFileSync,
  writeFileSync
} = require('fs-extra')

const ip = require('ip')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TARGET_PROJECT_PATH = process.cwd()
const packageInfo = require(`${TARGET_PROJECT_PATH}/package.json`)

const commonChunks = (packageInfo.commonChunks || []).concat([
  'preact',
  'style-loader'
])
const commonChunksReg = new RegExp(`[\\/](${commonChunks.join('|')})[\\/]`)

const genEntry = (appJsPath, pageName) => {
  let entryContent
  if (process.env.BUILD_TARGET !== 'local') {
    entryContent = `
    const { h, render } = require('preact')
    let App = require('${appJsPath}')
      .default
    if (typeof App === 'function') {
      let root = document.body.firstElementChild
      root = render(h(App), document.body, root)
    }
      `
  }
  else {
    entryContent = `
    const { h, render } = require('preact')
    require('preact/debug')
    let App = require('${appJsPath}')
      .default
    const hotLoader = require('react-hot-loader').default
    hotLoader.preact(require('preact').default)
    if (typeof App === 'function') {
      let root = document.body.firstElementChild
      let init = () => {
        let _app = require('${appJsPath}')
          .default
        root = render(h(_app), document.body, root)
      }
      if (module.hot)
        module.hot.accept(
          '${appJsPath}',
          init
        )
      init()
    }
      `
  }

  const entryFilePath = path.resolve(__dirname, `./entries/${pageName}.js`)
  createFileSync(entryFilePath)
  writeFileSync(entryFilePath, entryContent)
  return entryFilePath
}
const getEntries = dir => {
  const pagesDir = path.resolve(process.cwd(), dir)
  let entry = {}
  readdirSync(pagesDir).forEach(file => {
    const fullpath = path.join(pagesDir, file, 'entry.js')
    // 判断是不是存在
    if (existsSync(fullpath)) {
      // 提供了自定义entry
      entry[file] = fullpath
    }
    else {
      // 使用公共entry
      entry[file] = genEntry(path.join(pagesDir, file, 'app.js'), file)
    }
  })
  return entry
}
const entries = getEntries('./src/pages')
const pageTitlesMap = packageInfo.pages || {}
const HtmlWebpackPlugins = Object.keys(entries).map(
  k =>
    new HtmlWebpackPlugin({
      title: pageTitlesMap[k] || k,
      filename: `${k}.html`,
      template: path.resolve(__dirname, './template.html'),
      chunks: ['common', k]
    })
)
module.exports = {
  entry: entries,
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].[hash].js' // string
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-preset-env')({
                  browsers: 'last 2 versions'
                }),
                require('cssnano')({
                  preset: 'default'
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  exclude: ['@babel/plugin-transform-regenerator']
                }
              ]
            ],
            plugins: [
              ['@babel/plugin-transform-async-to-generator'],
              '@babel/plugin-syntax-dynamic-import',
              [
                '@babel/plugin-proposal-decorators',
                {
                  legacy: true
                }
              ],
              [
                '@babel/plugin-proposal-class-properties',
                {
                  loose: true
                }
              ],
              [
                'babel-plugin-transform-object-rest-spread',
                {
                  useBuiltIns: true
                }
              ],
              'babel-plugin-transform-export-extensions',
              '@babel/plugin-transform-react-constant-elements',
              [
                'babel-plugin-transform-react-jsx',
                {
                  pragma: 'h'
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    ...HtmlWebpackPlugins,
    new webpack.DefinePlugin({
      $BUILD_TARGET$: JSON.stringify(process.env.BUILD_TARGET)
    }),
    new CleanWebpackPlugin(['dist'], {
      root: process.cwd()
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'all',
          test: commonChunksReg,
          name: 'common'
        }
      }
    }
  },
  devServer: {
    host: ip.address(),
    hot: true
  },
  resolve: {
    modules: [
      'node_modules',
      `${TARGET_PROJECT_PATH}/node_modules/@ruiyun/h666-cli/node_modules`
    ],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class',
      'react-addons-css-transition-group': 'preact-css-transition-group'
    }
  },
  resolveLoader: {
    modules: [
      `${TARGET_PROJECT_PATH}/node_modules/@ruiyun/h666-cli/node_modules`,
      `${TARGET_PROJECT_PATH}/node_modules`
    ]
  }
}
