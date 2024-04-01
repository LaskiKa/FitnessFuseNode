const path = require("path");

module.exports = {
  entry: `./js/app.js`,
  output: {
    filename: "out.js",
    path: path.resolve(__dirname, `$/build`)
  },
  mode: 'development',
  devServer: {
    static: {
        directory: path.join(__dirname),
        publicPath: "/",
    },
    compress: true,
    port: 3001
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};
