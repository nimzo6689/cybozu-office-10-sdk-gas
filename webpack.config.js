const GasPlugin = require('gas-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: `./src/index.ts`,
  output: {
    path: `${__dirname}/dist`,
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    // 拡張子を配列で指定
    extensions: ['.ts', '.js'],
  },
  plugins: [new GasPlugin()],
};
