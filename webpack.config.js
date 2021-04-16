const path = require('path');

module.exports = {
  entry: './src/fsm.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'fsm.js',
    library: {
      name: 'fsm',
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        // exclude: /(node_modules|dist)/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(js)$/,
        // exclude: /(node_modules|dist)/,
        exclude: /node_modules/,
        use: "eslint-loader"
      },      
    ]
  },
  devtool: 'source-map',
};
