const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    typing: './src/apps/typing/index.js',
    sqlquiz: './src/apps/sqlquiz/index.js',
    chatlesson: './src/apps/chatlesson/index.js',
    teacherstudy: './src/apps/teacherstudy/matrix_mount.js'
  },
  output: {
    path: path.resolve(__dirname, '../static/js/react/'),
    filename: '[name].bundle.js',
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
