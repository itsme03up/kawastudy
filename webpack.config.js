const path = require('path');

module.exports = {
  entry: {
    main: './frontend/src/index.js',
    typing: './frontend/src/apps/typing/index.js',
    sqlquiz: './frontend/src/apps/sqlquiz/index.js',
    chatlesson: './frontend/src/apps/chatlesson/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'static/js/react'),
    filename: '[name].bundle.js',
    clean: true,
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
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'static'),
    },
    port: 3000,
    hot: true,
  }
};
