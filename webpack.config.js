const os = require('os');
const path = require('path');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const ErrorOverlayWebpackPlugin = require('error-overlay-webpack-plugin');

const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = {
    entry: path.resolve(SRC_DIR, 'index.ts'),
    devtool: 'inline-source-map',
    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: DIST_DIR,
        compress: true,
        quiet: true,
        hot: true,
        port: 9000,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
            SRC_DIR,
            'node_modules',
        ],
        alias: {
            "@": SRC_DIR,
            "@mas": path.resolve(SRC_DIR, 'multiagent-system'),
        },
    },
    module: {
        rules: [
            {
                test: /\.worker\.ts$/,
                exclude: /node_modules/,
                use: [
                    'worker-loader',
                    'ts-loader',
                ],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: os.cpus().length - 1,
                            poolRespawn: false,
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                        },
                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
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
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};
