const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const r = s => path.resolve(__dirname, s);

const wrapPath = obj => Object.fromEntries(Object.entries(obj)
    .map(([key, value]) => [key, r(value)]));

module.exports = {
    entry: './src2/index4.jsx',
    mode: 'development',
    // devtool: 'source-map',
    devServer: {hot: true},
    resolve: {
        extensions: ['.js', '.ts'],
        alias: wrapPath({
            '~': './',
            '#': './src2'
        })
    },
    output: {filename: 'main.js', path: r('./dist1')},
    module: {
        rules: [
            {test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-export-namespace-from'
                        ]
                    }
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
            {
                test: /\.(jpeg|jpg|png|gif)$/,
                loader: 'url-loader?limit=1024&name=static/images/[hash].[ext]'
            },
            {
                test: /\.(woff|woff2|ttf|eot|otf)/,
                loader:
                    'url-loader?limit=10000&name=static/fonts/[name].[ext]&mimetype=application/font-[ext]'
            },
            {
                test: /\.svg$/,
                loader:
                    'url-loader?limit=10000&name=static/fonts/[name].[ext]&mimetype=image/svg+xml'
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({template: './webpack-index.html'})],
};