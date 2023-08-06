const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: [__dirname + '/src/index.js', __dirname + '/src/index.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
