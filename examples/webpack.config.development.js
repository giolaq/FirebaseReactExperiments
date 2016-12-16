var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './index.js'
  ],

  output: {
    path: __dirname,
    publicPath: '/react-flip-move/examples',
    filename: 'dist/bundle.js',
    sourceMapFilename: 'dist/bundle.map'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      // JAVASCRIPT
      {
        test:     /\.jsx?$/,
        loader:   'babel',
        exclude:  /node_modules/
      },
      // SASS
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]',
      'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
    ]
  }
    ]
  }
}
