const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const r = s => path.resolve(__dirname, s);

const wrapPath = obj => Object.fromEntries(Object.entries(obj)
    .map(([key, value]) => [key, r(value)]));

module.exports = {
    entry: './src/index4.jsx',
    mode: 'development',
    devtool: 'source-map',
    devServer: {hot: true},
    resolve: {
        extensions: ['.js', '.ts'],
        alias: wrapPath({
            '~': './',
            '#': './src'
        })
    },
    output: {filename: 'main.js', path: './dist1'},
    module: {
        rules: [
            {test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {presets: ['@babel/preset-env', '@babel/preset-react']}
                }
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                exportLocalsConvention: 'camelCase',
                                localIdentName: '[local]_[hash:base64:3]'
                            }
                        }
                    },
                    'sass-loader'
                ],
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({template: './webpack-index.html'})],
};