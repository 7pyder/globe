const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	entry: {
		app: './src/js/main.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: 'dist',
		filename: '[name].js'
	},
	devtool: 'inline-source-map',
	mode: 'development',
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
		// new HtmlWebpackPlugin({
		// 	template: 'app.html',
		// 	filename: 'index.html',
		// 	minify: true
		// }),
		new UglifyJsPlugin()
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: { test: /[\\/]node_modules[\\/]/, name: "vendor", chunks: "all" }
			}
		}
	}
}
