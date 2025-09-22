import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const __dirname = import.meta.dirname;
const devMode = process.env.NODE_ENV !== 'production';

// Repo base path for GitHub Pages or environment, `PUBLIC_URL` is set by gh-pages.yml
const publicPath = process.env.PUBLIC_URL || '/';

export default {
  entry: [path.resolve(__dirname, 'src/index.js'), path.resolve(__dirname, 'src/index.scss')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle-[hash].min.js', // JS bundle filename
    publicPath, // Ensures assets resolve correctly for GH Pages
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle-[hash].min.css',
    }),

    // Generates index.html and injects JS/CSS automatically
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body', // Inject scripts before </body>
      base: publicPath, // <base> tag for GH Pages routing
      filename: 'index-[hash].html',
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
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: [
          devMode
            ? 'style-loader' // Injects styles into <head> during development
            : MiniCssExtractPlugin.loader, // Extract CSS into separate file for production
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles SCSS to CSS
          // TODO: PostCSS
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              '...', // Keep default rules
              {
                tag: 'img',
                attribute: 'src',
                type: 'src', // Rewrite <img src="..."> to hashed filenames
              },
            ],
          },
        },
      },

      // Images (optional, if you import them in JS/SCSS)
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // Emits files to dist/images
        generator: {
          filename: 'images/[name][hash][ext]', // Add content hash for cache busting
        },
      },

      // Fonts (optional, if you import fonts in SCSS or JS)
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource', // Emits fonts to dist/fonts
        generator: {
          filename: 'fonts/[name][ext]', // Keep original names
        },
      },
    ],
  },

  // Dev server configuration
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 5200,
    hot: true,
    open: true,
    watchFiles: ['public/**/*.html'],
  },

  // Source maps for dev mode
  devtool: devMode ? 'inline-source-map' : false,
};
