const path = require('path');
const chalk = require('chalk');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const ErrorOverlayWebpackPlugin = require('error-overlay-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        quiet: true,
        hot: true,
        port: 9000,
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
        alias: {
            "@": path.resolve(__dirname, 'src'),
            "@mas": path.resolve(__dirname, 'src/multiagent-system'),
        },
    },
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                exclude: /node_modules/,
                use: [
                    'worker-loader',
                ],
            },
            {
                test: /\.[jt]s?x$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'ts-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new ErrorOverlayWebpackPlugin(),
        new FriendlyErrorsPlugin({
            clearConsole: true,
            compilationSuccessInfo: {
                messages: [`You application is running here ${chalk.blue.bold('http://localhost:9000')}`]
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};
