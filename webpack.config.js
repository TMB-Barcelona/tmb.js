module.exports = {
    entry: './src/tmb.js',
    output: {
        path: './dist',
        filename: 'tmb.js',
        library: 'tmb',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ['node_modules']
    },
    externals: [
        "axios"
    ]
};
