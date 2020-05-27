const path = require('path');

module.exports = {
    entry: '.src/js/index.html',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'bundle.js'
    },
    mode: 'development'
};