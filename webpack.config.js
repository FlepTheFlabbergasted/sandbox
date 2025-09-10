import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const __dirname = import.meta.dirname;
const devMode = process.env.NODE_ENV !== 'production';

export default {
  entry: [__dirname + '/src/index.js', __dirname + '/src/index.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.min.js',
    publicPath: '',
    publicPath: process.env.PUBLIC_URL || '/',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.min.css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // Will auto inject <script> before </body> and makes it possible to process src="..." to hash filenames
      inject: 'body',
      base: process.env.PUBLIC_URL || '/',
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
              MiniCssExtractPlugin.loader,
          ,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',

          // TODO: CSS after stuff
        ],
      },

      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              // Default rules
              '...',
              // Rewrite <img src="..."> to the hashed filename
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
            ],
          },
        },
      },
    ],
  },
};
