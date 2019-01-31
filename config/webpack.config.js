const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const jsonfile = require('jsonfile')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const projectConfig = jsonfile.readFileSync('./project.config.json')
const autoConfig = require('./autoConfig.js')
const NODE_ENV = process.env.NODE_ENV

let entryConf
let pagesConf
if (projectConfig.autoConfig) {
  entryConf = autoConfig.entry
  pagesConf = autoConfig.pages
} else {
  entryConf = projectConfig.entry
  pagesConf = projectConfig.pages
}
pagesConf = pagesConf.map((item, i) => {
  return new HtmlWebpackPlugin({
    title: item.title || 'Document',
    template: `./src/views/${item.tmpl}`,
    filename: item.tmpl,
    minify: false,
    inject: true,
    chunks: item.scripts,
    chunksSortMode: 'manual'
  })
})

module.exports = {
  mode: 'prodoction',
  entry: entryConf,
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'js/[name].bdle.js?[chunkhash]',
    chunkFilename: 'js/[name].js?[chunkhash]',
    publicPath: '',
    hashDigestLength: 8
  },
  module: {
    rules: [
      // vue
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },

      // js
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },

      // html
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: false,
        }
      },

      // sass
      {
        test: /\.(scss|css)$/,
        exclude: [/node_modules/],
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7']
                })
              ]
            }
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: ['./src/assets/sass/helper/_util.scss', './src/assets/sass/helper/_variables.scss']
            },
          }
        ]
      },

      // png|jpg|gif
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: [/node_modules/],
        loader: 'url-loader',
        options: {
          context: './src/assets',
          name: `[path][name].[ext]?[hash:8]`,
          limit: 2 * 1024,
        }
      },

      // media
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          context: './src/assets',
          name: `[path][name].[ext]?[hash:8]`
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, './src')
    }
  },
  plugins: [

    new VueLoaderPlugin(),

    // clean build/
    new CleanWebpackPlugin('build/'),

    // webpack 全局变量:__DEV__
    new webpack.DefinePlugin({
      __DEV__: NODE_ENV === 'production' ? false : true
    }),

    new webpack.HashedModuleIdsPlugin(),

    // 提取 css
    new MiniCssExtractPlugin({
      filename: 'css/[name].css?[chunkhash:8]',
      chunkFilename: 'css/[name].css?[chunkhash:8]'
    }),

    // 复制文件
    new CopyWebpackPlugin([{
        from: __dirname + '/src/assets/images',
        to: 'images/',
        cache: true
      },
      {
        from: __dirname + '/src/js',
        to: 'js/',
        ignore: ['lib/**/*'],
        cache: true
      }
    ]),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      // minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      cacheGroups: {
        default: false,
        vendor1st: {
          name: 'vendor1st',
          minChunks: 3,
          priority: -1
        },
        vendor2nd: {
          name: 'vendor2nd',
          minChunks: 2,
          priority: -2
        }
      }
    }
  }
}
module.exports.plugins = (module.exports.plugins || []).concat(pagesConf)