const path = require('path');

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
    devtool: 'source-map', 
    context: path.resolve(__dirname, 'public'),
    module: {

    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        stats: 'errors-only',
        open: true,
        port: 8080,
        compress: true
    }
}