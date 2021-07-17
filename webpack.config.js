const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  entry: `./src/index.js`,
  mode: "development",

  output: {
    path: `${__dirname}/dist`,
    filename: "main.js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [new GasPlugin()],
};
