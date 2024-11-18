const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: path.resolve(__dirname, 'client', 'index.tsx'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'client', 'dist')
  },
  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js"],
    extensionAlias: {
     ".js": [".js", ".ts"],
     ".cjs": [".cjs", ".cts"],
     ".mjs": [".mjs", ".mts"]
    }
  },
  watch: true,
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'index.html')
    })
  ],
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: "defaults",
            presets: [
                ['@babel/preset-env'],
                ['@babel/preset-typescript' ],
                ['@babel/preset-react' ]
            ],
          }
        }
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'client'),
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
    ]
  }
};
