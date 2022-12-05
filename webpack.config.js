const path = require('path')
const webpack = require('webpack')

const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    devtool: 'source-map',

    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: 'js/build.[contenthash].js'
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.ts', '.js', '.vue', '.json']
    },
    
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json',
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        ts: 'ts-loader'
                    },
                    esModule: true
                    // other vue-loader options go here
                }
            },        
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

	plugins: [
        new VueLoaderPlugin(),

        new HtmlWebpackPlugin({
            template: "src/index.html",
            filename: "index.html",
            inject: "head"
        })
	],

	devServer: {
		host: "0.0.0.0",
        hot: false,
        contentBase: __dirname + "/dist",
        publicPath: '/'
	}
}
