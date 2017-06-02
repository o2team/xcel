'use strict'

const path = require('path')
const settings = require('./config.js')
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  devtool: '#eval-source-map',
  entry: {
    build: path.join(__dirname, 'app/src/main.js')
  },
  eslint: {
    formatter: require('eslint-friendly-formatter'),
    configFile: './.eslintrc'
  },
  module: {
    preloaders: [
      {
        test: /\.js$/,
        loader: 'babel!eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
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
      }
    ]
  },
  devServer: {
    outputPath: path.join(__dirname, 'dist')
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './app/main.ejs',
      title: settings.name
    }),
    new webpack.NoErrorsPlugin(),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'app/src/background'), to: path.join(__dirname, 'app/dist/background') },
      { from: path.join(__dirname, 'app/src/update'), to: path.join(__dirname, 'app/dist/update') }
    ])
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'app/dist')
  },
  resolve: {
    alias: {
      'components': path.join(__dirname, 'app/src/components'),
      'src': path.join(__dirname, 'app/src')
    },
    extensions: ['', '.js', '.vue', '.json', '.css'],
    fallback: [path.join(__dirname, 'app/node_modules')]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  target: 'electron-renderer',
  vue: {
    autoprefixer: {
      browsers: ['last 2 Chrome versions']
    },
    loaders: {
      sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
      scss: 'vue-style-loader!css-loader!sass-loader',
      js: 'babel!eslint'
    }
  },
  node: {
    fs: 'empty'
  },
  externals: [
    {
      './cptable': 'var cptable',
      '../xlsx.js': 'var _XLSX'
    }
  ]
}

/**
 * Adjust config for production settings
 */
if (process.env.NODE_ENV === 'production') {
  config.devtool = ''

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

module.exports = config
