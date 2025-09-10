import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const __dirname = import.meta.dirname;
const devMode = process.env.NODE_ENV !== 'production';

export default {
  entry: [__dirname + '/src/index.js', __dirname + '/src/index.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.min.js',
    publicPath: '/public/',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.min.css',
      chunkFilename: '[name].css',
      linkType: 'text/css',
    }),
  ],
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
          devMode
            ? // Creates `style` nodes from JS strings
              'style-loader'
            : // Extracts CSS into separate files (for prod)
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '/public/',
                },
              },
          ,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
};
