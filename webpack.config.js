const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'

const config = {
	entry: {
		app: './src/js/main.js'
	},
	output: {
		path: path.join(__dirname, 'public'),
		filename: '[name].[chunkhash].js'
	},
	devtool: 'inline-source-map',
	mode: mode,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})
	]
}

if (mode === 'production') {
	config.plugins.push(
		new CopyWebpackPlugin([
			{from: 'assets', to: 'assets'}
		]),
		new UglifyJsPlugin()
	)

	Object.assign(config, {
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: { test: /[\\/]node_modules[\\/]/, name: "vendor", chunks: "all" }
				}
			}
		}
	})
}

module.exports = config
