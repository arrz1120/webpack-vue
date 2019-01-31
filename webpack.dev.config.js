const path=require('path')
const webpack=require('webpack')
const HtmlWebpackPlugin=require('html-webpack-plugin')
const CopyWebpackPlugin=require('copy-webpack-plugin')
const autoprefixer=require('autoprefixer')
const lanIp=require('address').ip()
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const projectConfig=require('./project.config.js')
const {webpackEntry,webpackHTML}=require('./config/webpackEntry.js')
const NODE_ENV=process.env.NODE_ENV

module.exports={
  mode:'development',
  entry:webpackEntry,
  output:{
    path:path.resolve(__dirname,'./build'),
    filename:'js/[name].bdle.js',
    chunkFilename:'js/[name].[hash:6].js',
    publicPath:'',
    hashDigestLength:8,
  },
  module:{
    rules:[
      // vue
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },

      // js
      {
        test:/\.js$/,
        use:'babel-loader',
        exclude:/node_modules/
      },

      // html
      {
        test:/\.html$/,
        use:[{
          loader:'html-loader',
          // options: {
          //   minimize: false,
          //   removeComments: false,
          //   collapseWhitespace: false
          // }
        }]
      },

      // sass
      {
        test: /\.(scss|css)$/,
        use: [
          'vue-style-loader',
          {
            loader:'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader:'postcss-loader',
            options:{
              ident:'postcss',
              sourceMap: true,
              plugins:()=>[
                autoprefixer({
                  browsers:['last 2 versions','Android >= 4.0','iOS 7']
                })
              ]
            }
          },
          {
            loader:'sass-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: ['./src/assets/sass/helper/_util.scss','./src/assets/sass/helper/_variables.scss']
            },
          }
        ]
      },


      // png|jpg|gif
      {
        test:/\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude:[/node_modules/],
        loader: 'url-loader',
        options: {
          context:'./src',
          name: `[path][name].[ext]`,
          limit: 1,
        }
      },

      // media
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        exclude:[/node_modules/],
        loader: 'url-loader',
        options: {
          context:'./src',
          name: `[path][name].[ext]`
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
  plugins:[

    new VueLoaderPlugin(),

    // webpack 全局变量:__DEV__
    new webpack.DefinePlugin({
      __DEV__:NODE_ENV==='production'?false:true
    }),

    // 复制文件
    new CopyWebpackPlugin([
      {
        from:__dirname+'/src/assets/images',
        to:'assets/images/',
        cache:true
      },
      {
        from:__dirname+'/src/js',
        to:'js/',
        ignore:['lib/**/*'],
        cache:true
      },
    ]),
    
    new webpack.NamedModulesPlugin(),

  ],
  devServer:{
    port:projectConfig.clientPort,
    contentBase:'./build',
    historyApiFallback:true,
    inline:true,
    host:lanIp,
    noInfo:true,
    open:true,
    clientLogLevel:'warning',
    // 解决 Invalid Host header
    disableHostCheck: true,
    after(){
      console.log('-----------------------------------------------')
      console.log(`Project is running at http://${lanIp}:${projectConfig.clientPort}`)
      console.log('-----------------------------------------------')
    },
    /*
    proxy:{
      '/mock':{
        target:`代理服务器地址`,
        pathRewrite:{'^/mock':''},
        changeOrigin: true,
      }
    }
    */
  },
  devtool:'cheap-module-eval-source-map'
}
const webpackHTMLConf=webpackHTML.map(item=>{
  return new HtmlWebpackPlugin({
    title:'Document',
    template:item.tmpl,
    filename:item.output,
    minify:false,
    inject:true,
    chunks:item.scripts,
    chunksSortMode:'manual'
  })
})
module.exports.plugins=(module.exports.plugins||[]).concat(webpackHTMLConf)