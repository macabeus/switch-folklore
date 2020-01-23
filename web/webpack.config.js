const host = '0.0.0.0'
const port = 9000

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
    host,
    port,
    sockHost: host,
    sockPort: port,
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}
