var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  entry: [
    './web/static/js/app.js'
  ],

  output: {
    path: "./priv/static/js",
    filename: "app.js",
    publicPath: "http://localhost:8080/js/"
  },

  postcss: function () {
    return [autoprefixer];
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname),
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }, {
        test: /\.scss$/,
        // Extract into styles.css file example: https://github.com/css-modules/webpack-demo/blob/master/webpack.config.js
        loader: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
          'sass',
          'postcss'
        ].join('!')
      }
    ]
  }
}
