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
    publicPath: '', // keep paths relative so GH Pages works
    publicPath: process.env.PUBLIC_URL || '/',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.min.css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body', // will auto inject <script> before </body>
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
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
    ],
  },
};
