import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const rules = [
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  },
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            'env',
            {
              'targets': {
                'browsers': ['last 2 versions']
              }
            }
          ]
        ],
        plugins: [
          'transform-remove-strict-mode' // in order to make mermaid work
        ]
      }
    }
  }
]

// http://www.matthiassommer.it/software-architecture/webpack-node-modules/
const config = {
  target: 'electron-renderer',
  entry: {
    'index': './src/index.js'
  },
  // externals: 'fs', // in order to make mermaid work
  externals: {
    "electron": "require('electron')",
    "child_process": "require('child_process')",
    "fs": "require('fs')",
    "path": "require('path')"
  },
  output: {
    path: path.join(__dirname, './dist/'),
    filename: '[name].bundle.js'
  },
  module: { rules },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css')
  ]
}

export default [config]
