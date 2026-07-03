var path = require('path');

module.exports = {
    mode: 'production',
    target: ['web', 'es5'],
    entry: './src/tmb',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'tmb.js',
        library: 'tmb',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    devtool: 'source-map',
    resolve: {
        modules: ['node_modules']
    },
    devServer: {
        server: {
            type: 'https'
        }
    }
};
