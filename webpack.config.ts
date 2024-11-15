const HTMLWebPackPlugin =  require('html-webpack-plugin');

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
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
     ".js": [".js", ".ts"],
     ".cjs": [".cjs", ".cts"],
     ".mjs": [".mjs", ".mts"]
    }
  },
  watch: true,
  plugins: [new HTMLWebPackPlugin()],
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader", exclude: "/node_modules/", use: {loader: 'babel-loader', options: {presets: ['@babel/core', '@babel/preset-env', '@babel/preset-typescript']}} }
    ]
  }
};