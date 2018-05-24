const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'app', 'index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },

            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },

            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000
                        }
                    }
                ]
            },

            { 
                test: /\.(eot|svg|ttf|woff2?|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        stats: 'errors-only',
        open: true,
        port: 8080,
        compress: true
    }
}