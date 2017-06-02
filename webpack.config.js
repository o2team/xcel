'use strict'

const path = require('path')
const settings = require('./config.js')
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
module.exports = function () {
  const config = {
    entry: {
      app: [path.join(__dirname, 'app/src/main.js')],
      // vendor: [
      //   'vue',
      //   'vue-electron',
      //   'vue-router',
      //   'vuex'
      // ]
    },
    output: {
      path: path.join(__dirname, 'app/dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.vue', '.json', '.css', '.js'],
      alias: {
        components: path.join(__dirname, 'app/src/components'),
        src: path.join(__dirname, 'app/src')
      },
      // modules: [
      //   path.join(__dirname, 'app/node_modules')
      // ]
    },
    resolveLoader: {
      modules: [
        path.join(__dirname, 'node_modules')
      ]
    },
    module: {
      rules: [{
        test: /\.vue$/,
        use: 'vue-loader',
          // options: {
          //   loaders: {
          //     css: 'vue-style-loader!css-loader',
          //     postcss: 'vue-style-loader!css-loader',
          //     sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          //     scss: 'vue-style-loader!css-loader!sass-loader'
          //   }
          // }
      },
      /* {
        test: /\.js$/,
        use: 'babel!eslint',
        exclude: /node_modules/
      }, */
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.join(__dirname, 'app/src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [new RegExp(`node_modules\\${path.sep}(?!vue-bulma-.*)`)]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'imgs/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.css$/,
        loader: 'vue-style-loader!css-loader'
      },
      {
        test: /\.sass$/,
        loader: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
      },
      {
        test: /\.scss$/,
        loader: 'vue-style-loader!css-loader!sass-loader'
      }
      ]
    },
    devtool: isProd ? '#source-map' : '#eval-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'app/dist')
      // watch: true,
      // watchOptions: {
      //   poll: true
      // }
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'styles.css',
        disable: false,
        allChunks: true
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './app/main.ejs',
        title: settings.name
      }),
      // new webpack.NoErrorsPlugin(),
      new CopyWebpackPlugin([{
        from: path.join(__dirname, 'app/src/background'),
        to: path.join(__dirname, 'app/dist/background')
      },
      {
        from: path.join(__dirname, 'app/src/update'),
        to: path.join(__dirname, 'app/dist/update')
      }
      ])
    ],
    target: 'electron',
    externals: [{
      './cptable': 'var cptable',
      '../xlsx.js': 'var _XLSX'
    }],
    node: {
      fs: 'empty'
    },
    performance: {
      hints: false
    }
  }

  if (isProd) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      })
      // new webpack.optimize.OccurenceOrderPlugin()
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: false
      //   }
      // })
    )
  } else {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
      })
      // new webpack.NoEmitOnErrorsPlugin(),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor',
      //   filename: 'vendor.js'
      // })
    )
  }

  return config
}
