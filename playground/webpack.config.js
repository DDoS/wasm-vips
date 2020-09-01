const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ASSET_PATH = 'https://wasm-vips.kleisauke.nl/playground/';

module.exports = {
    mode: 'production',
    entry: {
        playground: './src/index.js',
        samples: './src/samples.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'assets/js/[name].js',
        chunkFilename: 'assets/js/[name].js',
        publicPath: ASSET_PATH
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../'
                        }
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.(jpe?g|png|gif|tiff?|webp|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets/images/"
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets/fonts/"
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    test: /[\\/](monaco-editor)[\\/]/,
                    name: 'monaco-editor'
                },
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "assets/css/[name].css",
        }),
        new HtmlWebpackPlugin({
            title: 'wasm-vips playground',
            template: './src/index.html'
        }),
        new MonacoWebpackPlugin({
            filename: 'assets/js/monaco-[name].worker.js',
            languages: ['typescript', 'javascript', 'html', 'css']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'samples'),
                    to: path.join(__dirname, 'dist', 'samples'),
                },
                {
                    from: path.join(__dirname, 'src', 'playground-runner.html'),
                    to: path.join(__dirname, 'dist'),
                }
            ],
        })
    ],
    devServer: {
        writeToDisk: true,
        contentBase: path.join(__dirname, 'dist'),
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Resource-Policy': 'cross-origin'
        },
    }
};
