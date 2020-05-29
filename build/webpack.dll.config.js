// webpack_dll.config.js
const path = require('path')
const webpack = require('webpack')
const DllPlugin = webpack.DllPlugin
module.exports = {
  entry: {
    polyfill: ['@babel/polyfill'],
    vue: ['vue/dist/vue.esm.js', 'vue-router'],
    vant: ['vant'],
    axios: ['axios']
  },
  output: {
    filename: '[name]_[hash:6].dll.js',
    path: path.resolve(__dirname, '../dist/dll'),
    library: '[name]_[hash:6]' // dll的全局变量名
  },
  plugins: [
    new DllPlugin({
      name: '[name]_[hash:6]', // dll的全局变量名
      path: path.join(__dirname, '../dist/dll', '[name].manifest.json') // 描述生成的manifest文件
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
