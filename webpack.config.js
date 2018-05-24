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