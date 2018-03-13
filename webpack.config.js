const path = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const cssnano = require('cssnano');

const config = {
  devtool: 'eval-source-map',
  mode: process.env.ENV === 'PRODUCTION' ? 'production' : 'development',
  entry: [
    path.join(__dirname, 'client/src/index.js'),
  ],
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'client/src/components',
      'client/src',
      'client/static',
      'node_modules',
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties', 
            'transform-function-bind',
            'transform-object-rest-spread',
            'transform-export-extensions',
          ],
        },
      },
    ]
  },
  plugins: [
    // Move to prod/noprod section for hash injection
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: 'client/static/index.html',
      inject: false,
    }),
  ],
  devServer: {
    // publicPath: '/',
    stats: {
      excludeModules: /webpack/,
    },
    inline: true,
    contentBase: path.join(__dirname, 'client/src/'),
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:3001', secure: false },
      '/static': { target: 'ws://localhost:3001', ws: true }, 
    }
  },
};


if (config.mode === 'production') {
  console.log('Doing prod business.')
  // config.entry.shift();
  config.plugins.push(
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'client/static'),
      to: path.join(__dirname, 'client/dist/static'),
    }]),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'client/mobile'),
      to: path.join(__dirname, 'client/dist'),
    }]),
    new ExtractTextPlugin({ 
      filename: 'styles.css', 
      disable: false, 
      allChunks: true 
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: cssnano,
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
  );
  config.module.rules.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader'],
      }),
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader', use: 'css-loader',
      }),
    },
  );
} else {
  config.module.rules.push(
    {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
    },
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
    },
  );
}

module.exports = config;